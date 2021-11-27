import { WasmTestVideoAbstractBaseClass } from './index';

export default class VideoThresholdWasmTest extends WasmTestVideoAbstractBaseClass {
  _work: any;

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
    this.module._imageThreshold(this.pointer1, this.width, this.height);
  }

  runJavaScript(): void {
    if (this._work === undefined) {
      this._work = new Int32Array(this.width * this.height);
    }

    const array = this._work;
    const s = 8;
    const s2 = s / 2;
    const t = 15;
    const t2 = (100 - t) / 100;
    for (let i = 0; i < this.width; i++) {
      let sum = 0;
      for (let j = 0; j < this.height; j++) {
        const index = j * this.width + i;
        const r = this.jsImageDataArray[index * 4 + 0];
        const g = this.jsImageDataArray[index * 4 + 1];
        const b = this.jsImageDataArray[index * 4 + 2];
        this.jsImageDataArray[index * 4] =
          (0.2126 * r + 0.7152 * g + 0.0722 * b) | 0;
        sum += this.jsImageDataArray[index * 4];
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

        if (x1 < 0) {
          x1 = 0;
        }
        if (x2 >= this.width) {
          x2 = this.width - 1;
        }
        if (x1_1 < 0) {
          x1_1 = 0;
        }
        if (y1 < 0) {
          y1 = 0;
        }
        if (y2 >= this.height) {
          y2 = this.height - 1;
        }
        if (y1_1 < 0) {
          y1_1 = 0;
        }

        const count = (x2 - x1) * (y2 - y1);
        const index = j * this.width + i;
        const index1 = y2 * this.width + x2;
        const index2 = y1_1 * this.width + x2;
        const index3 = y2 * this.width + x1_1;
        const index4 = y1_1 * this.width + x1_1;
        const sum =
          array[index1] - array[index2] - array[index3] + array[index4];
        if (this.jsImageDataArray[index * 4] * count <= sum * t2) {
          this.jsImageDataArray[index * 4 + 0] =
            this.jsImageDataArray[index * 4 + 1] =
            this.jsImageDataArray[index * 4 + 2] =
              0;
        } else {
          this.jsImageDataArray[index * 4 + 0] =
            this.jsImageDataArray[index * 4 + 1] =
            this.jsImageDataArray[index * 4 + 2] =
              255;
        }
      }
    }
  }
}
