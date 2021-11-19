import { WasmTestAbstractBaseClass } from './index';

export default class ImageConvoluteWasmTest extends WasmTestAbstractBaseClass {
  image: any;
  canvas: any;
  jsCanvas: any;
  wsCanvas: any;
  jsContext: any;
  wsContext: any;
  imageData: any;
  jsImageData: any;
  wsImageData: any;
  width: number;
  height: number;
  _work: Int32Array;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    module: Object,
    dom: any,
    jsCanvas: any,
    wsCanvas: any,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, module);
    this.image = dom;
    this.width = this.image.width;
    this.height = this.image.height;
    this.jsCanvas = jsCanvas;
    this.wsCanvas = wsCanvas;
    this._work = new Int32Array(this.width * this.height);
    this.initCanvasData();
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
    this.module._imageThreshold(pointer, this.width, this.height);
    this.wsImageData.data.set(
      this.module.HEAPU8.subarray(
        offset,
        offset + this.wsImageData.data.length,
      ),
    );
    this.module._free(pointer);
  }

  runJavaScript(): void {
    const array = this._work;
    const s = 8;
    const s2 = s / 2;
    const t = 15;
    const t2 = (100 - t) / 100;
    for (let i = 0; i < this.width; i++) {
      let sum = 0;
      for (let j = 0; j < this.height; j++) {
        let index = j * this.width + i;
        let r = this.jsImageData.data[index * 4 + 0];
        let g = this.jsImageData.data[index * 4 + 1];
        let b = this.jsImageData.data[index * 4 + 2];
        this.jsImageData.data[index * 4] =
          (0.2126 * r + 0.7152 * g + 0.0722 * b) | 0;
        sum += this.jsImageData.data[index * 4];
        if (i === 0) {
          array[index] = sum;
        } else {
          array[index] = array[index - 1] + sum;
        }
      }
    }
    for (let i = 0; i < this.width; i++) {
      for (let j = 0; j < this.height; j++) {
        let x1 = i - s2;
        let x2 = i + s2;
        let y1 = j - s2;
        let y2 = j + s2;
        let x1_1 = x1 - 1;
        let y1_1 = y1 - 1;
        if (x1 < 0) x1 = 0;
        if (x2 >= this.width) x2 = this.width - 1;
        if (x1_1 < 0) x1_1 = 0;
        if (y1 < 0) y1 = 0;
        if (y2 >= this.height) y2 = this.height - 1;
        if (y1_1 < 0) y1_1 = 0;
        const count = (x2 - x1) * (y2 - y1);
        const index = j * this.width + i;
        const index1 = y2 * this.width + x2;
        const index2 = y1_1 * this.width + x2;
        const index3 = y2 * this.width + x1_1;
        const index4 = y1_1 * this.width + x1_1;
        const sum =
          array[index1] - array[index2] - array[index3] + array[index4];
        if (this.jsImageData.data[index * 4] * count <= sum * t2) {
          this.jsImageData.data[index * 4 + 0] =
            this.jsImageData.data[index * 4 + 1] =
            this.jsImageData.data[index * 4 + 2] =
              0;
        } else {
          this.jsImageData.data[index * 4 + 0] =
            this.jsImageData.data[index * 4 + 1] =
            this.jsImageData.data[index * 4 + 2] =
              255;
        }
      }
    }
  }
}
