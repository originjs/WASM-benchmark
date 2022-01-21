import { Modules, WasmTestImageBaseClass } from './index';

export default class ImageThresholdWasmTest extends WasmTestImageBaseClass {
  _work: Int32Array;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Modules,
    dom: any,
    jsCanvas: any,
    wsCanvas: any,
  ) {
    super(
      dataSize,
      warmUpRunLoops,
      benchmarkRunLoops,
      modules,
      dom,
      jsCanvas,
      wsCanvas,
    );
    this._work = new Int32Array(this.width * this.height);
    this.initImageCanvasData();
    this.initTestData();
  }

  initTestData() {
    this.copyArray(this.imageData.data, this.jsImageData.data);
    this.copyArray(this.imageData.data, this.wsImageData.data);
  }

  check(jsRes: any, wasmRes: any): boolean {
    this.jsContext.putImageData(this.jsImageData, 0, 0);
    this.wsContext.putImageData(this.wsImageData, 0, 0);
    return this.equalArray(this.jsImageData.data, this.wsImageData.data);
  }

  getAllRunWasmFunc(): Array<Function> {
    const runCWasm = () => {
      const module = this.modules.cModule;

      const pointer = module._malloc(this.wsImageData.data.length);
      const offset = pointer;
      module.HEAPU8.set(this.wsImageData.data, offset);
      module._imageThreshold(pointer, this.width, this.height);
      this.wsImageData.data.set(
        module.HEAPU8.subarray(offset, offset + this.wsImageData.data.length),
      );
      module._free(pointer);
    };
    return [runCWasm];
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
