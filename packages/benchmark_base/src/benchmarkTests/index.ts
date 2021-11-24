export interface WasmTestInterface {
  initTestData(): void;
  checkFunctionality(): boolean;
  runWasm(): number | void;
  runWasmBenchmark(): string;
  runJavaScript(): number | void;
  runJavaScriptBenchmark(): string;
}

export class WasmTestAbstractBaseClass implements WasmTestInterface {
  warmUpRunLoops: number;
  benchmarkRunLoops: number;
  module: any;
  shouldOverrideError: Error;
  constructor(
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    module: Object,
  ) {
    this.warmUpRunLoops = warmUpRunLoops;
    this.benchmarkRunLoops = benchmarkRunLoops;
    this.module = module;
    this.shouldOverrideError = Error(
      'Should override this function in sub class',
    );
  }

  initTestData() {
    throw this.shouldOverrideError;
  }

  checkFunctionality(): boolean {
    throw this.shouldOverrideError;
  }

  runWasm(): number | void {
    throw this.shouldOverrideError;
  }

  runJavaScript(): number | void {
    throw this.shouldOverrideError;
  }

  runWasmBenchmark(): string {
    for (let i = 0; i < this.warmUpRunLoops; i++) {
      this.runWasm(); // warm-up
    }
    let elapsedTime = 0.0;
    for (let i = 0; i < this.benchmarkRunLoops; i++) {
      let startTime = performance.now();
      this.runWasm();
      let endTime = performance.now();
      elapsedTime += endTime - startTime;
    }
    return (elapsedTime / this.benchmarkRunLoops).toFixed(4);
  }

  runJavaScriptBenchmark() {
    for (let i = 0; i < this.warmUpRunLoops; i++) {
      this.runJavaScript(); // warm-up
    }
    let elapsedTime = 0.0;
    for (let i = 0; i < this.benchmarkRunLoops; i++) {
      let startTime = performance.now();
      this.runJavaScript();
      let endTime = performance.now();
      elapsedTime += endTime - startTime;
    }
    return (elapsedTime / this.benchmarkRunLoops).toFixed(4);
  }

  equalArray(array1: any, array2: any): boolean {
    if (array1.length !== array2.length) return false;
    for (let i = 0, il = array1.length; i < il; i++) {
      if (array1[i] !== array2[i]) return false;
    }
    return true;
  }

  copyArray(src: any, res: any) {
    for (let i = 0, il = src.length; i < il; i++) {
      res[i] = src[i];
    }
  }
}

export class WasmTestImageAbstractBaseClass
  extends WasmTestAbstractBaseClass
  implements WasmTestInterface
{
  image: any;
  canvas: any;
  jsCanvas: any;
  wsCanvas: any;
  jsContext: any;
  wsContext: any;
  width: number;
  height: number;
  imageData: any;
  jsImageData: any;
  wsImageData: any;

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
  }

  initImageCanvasData() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    const context = this.canvas.getContext('2d');
    context.drawImage(this.image, 0, 0);
    this.imageData = context.getImageData(0, 0, this.width, this.height);

    this.jsCanvas.width = this.width;
    this.jsCanvas.height = this.height;
    this.jsContext = this.jsCanvas.getContext('2d');
    this.jsImageData = this.jsContext.getImageData(
      0,
      0,
      this.width,
      this.height,
    );

    this.wsCanvas.width = this.width;
    this.wsCanvas.height = this.height;
    this.wsContext = this.wsCanvas.getContext('2d');
    this.wsImageData = this.wsContext.getImageData(
      0,
      0,
      this.width,
      this.height,
    );
  }
}
