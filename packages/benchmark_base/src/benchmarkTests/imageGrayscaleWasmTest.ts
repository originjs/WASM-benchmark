import { WasmTestImageAbstractBaseClass } from './index';

export default class ImageConvoluteWasmTest extends WasmTestImageAbstractBaseClass {
  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    module: Object,
    dom: any,
    jsCanvas: any,
    wsCanvas: any,
  ) {
    super(
      dataSize,
      warmUpRunLoops,
      benchmarkRunLoops,
      module,
      dom,
      jsCanvas,
      wsCanvas,
    );
    this.initImageCanvasData();
  }

  checkFunctionality(): boolean {
    this.copyArray(this.imageData.data, this.jsImageData.data);
    this.copyArray(this.imageData.data, this.wsImageData.data);
    this.runWasm();
    this.runJavaScript();
    this.jsContext.putImageData(this.jsImageData, 0, 0);
    this.wsContext.putImageData(this.wsImageData, 0, 0);
    return this.equalArray(this.jsImageData.data, this.wsImageData.data);
  }

  runWasm(): void {
    const pointer = this.module._malloc(this.wsImageData.data.length);
    const offset = pointer;
    this.module.HEAPU8.set(this.wsImageData.data, offset);
    this.module._imageGrayscale(pointer, this.width, this.height);
    this.wsImageData.data.set(
      this.module.HEAPU8.subarray(
        offset,
        offset + this.wsImageData.data.length,
      ),
    );
    this.module._free(pointer);
  }

  runJavaScript(): void {
    for (let i = 0, il = this.width * this.height; i < il; i++) {
      const r = this.jsImageData.data[i * 4 + 0];
      const g = this.jsImageData.data[i * 4 + 1];
      const b = this.jsImageData.data[i * 4 + 2];
      this.jsImageData.data[i * 4 + 0] =
        this.jsImageData.data[i * 4 + 1] =
        this.jsImageData.data[i * 4 + 2] =
          (0.2126 * r + 0.7152 * g + 0.0722 * b) | 0;
    }
  }
}