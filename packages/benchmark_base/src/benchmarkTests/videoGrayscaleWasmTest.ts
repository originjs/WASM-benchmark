import { WasmTestVideoAbstractBaseClass } from './index';

export default class VideoConvoluteWasmTest extends WasmTestVideoAbstractBaseClass {
  pointer1: any;

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
  }

  initVideoCanvasData(): void {
    // for Original
    this.videoDataArray = new Uint8Array(this.length);
    this.updateOriginalImageData();

    // for JavaScript
    this.jsImageDataArray = new Uint8ClampedArray(this.length);
    this.jsImageData = new ImageData(
      this.jsImageDataArray,
      this.width,
      this.height,
    );

    // for WebAssembly
    this.pointer1 = this.module._malloc(this.length);
    const offset1 = this.pointer1;
    const uint8ClampedArray = new Uint8ClampedArray(this.module.HEAPU8.buffer);
    this.wsImageDataArray = uint8ClampedArray.subarray(
      offset1,
      offset1 + this.length,
    );
    this.wsImageData = new ImageData(
      this.wsImageDataArray,
      this.width,
      this.height,
    );
  }

  render(vueInstance: any) {
    this.updateOriginalImageData();
    this.copyArray(this.videoDataArray, this.jsImageDataArray);
    this.copyArray(this.videoDataArray, this.wsImageDataArray);

    this.jsElapsedTime += this.runJavaScriptBenchmark();
    this.wsElapsedTime += this.runWasmBenchmark();
    this.jsContext.putImageData(this.jsImageData, 0, 0);
    this.wsContext.putImageData(this.wsImageData, 0, 0);
    this.count++;

    if (this.count === this.benchmarkRunLoops) {
      const jsPerformance = (
        this.jsElapsedTime / this.benchmarkRunLoops
      ).toFixed(4);
      const wsPerformance = (
        this.wsElapsedTime / this.benchmarkRunLoops
      ).toFixed(4);
      vueInstance.jsPerformance = jsPerformance;
      vueInstance.wsPerformance = wsPerformance;
      vueInstance.comparison = (
        Number(jsPerformance) / Number(wsPerformance)
      ).toFixed(4);
      this.jsElapsedTime = 0.0;
      this.wsElapsedTime = 0.0;
      this.count = 0;
    }
  }

  checkFunctionality(): boolean {
    if (!this.videoCanvasDataInited) {
      this.initVideoCanvasData();
      this.videoCanvasDataInited = true;
    }
    this.copyArray(this.videoDataArray, this.jsImageDataArray);
    this.copyArray(this.videoDataArray, this.wsImageDataArray);
    this.runWasm();
    this.runJavaScript();
    return this.equalArray(this.jsImageDataArray, this.wsImageDataArray);
  }

  runWasm(): void {
    this.module._imageGrayscale(this.pointer1, this.width, this.height);
  }

  runJavaScript(): void {
    for (let i = 0, il = this.width * this.height; i < il; i++) {
      var r = this.jsImageDataArray[i * 4 + 0];
      var g = this.jsImageDataArray[i * 4 + 1];
      var b = this.jsImageDataArray[i * 4 + 2];
      this.jsImageDataArray[i * 4 + 0] =
        this.jsImageDataArray[i * 4 + 1] =
        this.jsImageDataArray[i * 4 + 2] =
          (0.2126 * r + 0.7152 * g + 0.0722 * b) | 0;
    }
  }
}
