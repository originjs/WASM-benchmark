import { Modules, WasmTestImageBaseClass } from './index';

export default class ImageConvoluteWasmTest extends WasmTestImageBaseClass {
  weights: Float64Array = new Float64Array([
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
    1 / 25,
  ]);
  wWidth: number = 5;
  wHeight: number = 5;

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
    this.initImageCanvasData();
  }

  check(jsRes: any, wasmRes: any): boolean {
    this.jsContext.putImageData(this.jsImageData, 0, 0);
    this.wsContext.putImageData(this.wsImageData, 0, 0);
    return this.equalArray(this.jsImageData.data, this.wsImageData.data);
  }

  runCWasm(): void {
    const module = this.modules.cModule;

    let pointer1 = module._malloc(this.imageData.data.length);
    let pointer2 = module._malloc(this.wsImageData.data.length);
    let pointer3 = module._malloc(this.weights.length * 8);
    let offset1 = pointer1;
    let offset2 = pointer2;
    let offset3 = pointer3 / 8;
    module.HEAPU8.set(this.imageData.data, offset1);
    module.HEAPF64.set(this.weights, offset3);
    module._imageConvolute(
        pointer1,
        pointer2,
        this.width,
        this.height,
        pointer3,
        this.wWidth,
        this.wHeight,
    );
    this.wsImageData.data.set(
        module.HEAPU8.subarray(offset2, offset2 + this.wsImageData.data.length),
    );
    module._free(pointer1);
    module._free(pointer2);
    module._free(pointer3);
  }

  runRustWasm() {
    this.modules.rustModule.imageConvolute(this.imageData.data, this.wsImageData.data, this.width, this.height, this.weights, this.wWidth, this.wHeight)
  }

  runJavaScript(): void {
    const halfWWidth = (this.wWidth / 2) | 0;
    const halfWHeight = (this.wHeight / 2) | 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let r = 0;
        let g = 0;
        let b = 0;
        let a = 0;
        for (let wy = 0; wy < this.wHeight; wy++) {
          const sy = y + wy - halfWHeight;
          if (sy < 0 || sy >= this.height) continue;
          for (let wx = 0; wx < this.wWidth; wx++) {
            const sx = x + wx - halfWWidth;
            if (sx < 0 || sx >= this.width) continue;
            let index = sy * this.width + sx;
            let weight = this.weights[wy * this.wWidth + wx];
            r += this.imageData.data[index * 4 + 0] * weight;
            g += this.imageData.data[index * 4 + 1] * weight;
            b += this.imageData.data[index * 4 + 2] * weight;
            a += this.imageData.data[index * 4 + 3] * weight;
          }
        }
        const index = y * this.width + x;
        this.jsImageData.data[index * 4 + 0] = r | 0;
        this.jsImageData.data[index * 4 + 1] = g | 0;
        this.jsImageData.data[index * 4 + 2] = b | 0;
        this.jsImageData.data[index * 4 + 3] = a | 0;
      }
    }
  }
}
