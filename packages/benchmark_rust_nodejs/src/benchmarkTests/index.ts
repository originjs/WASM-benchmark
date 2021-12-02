import {WasmTestInterface} from "../../../benchmark_base/src/benchmarkTests";


export class RustWasmTestAbstractBaseClass implements WasmTestInterface {
  warmUpRunLoops: number;
  benchmarkRunLoops: number;
  rustWasmFunc: Function;
  shouldOverrideError: Error;
  performance: any;

  constructor(
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    rustWasmFunc: Function,
  ) {
    this.warmUpRunLoops = warmUpRunLoops;
    this.benchmarkRunLoops = benchmarkRunLoops;
    this.rustWasmFunc = rustWasmFunc;
    this.shouldOverrideError = Error(
      'Should override this function in sub class',
    );
    if (typeof window === 'undefined' && typeof global === 'object') {
      this.performance = require('perf_hooks').performance;
    } else {
      this.performance = performance;
    }
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
      let startTime = this.performance.now();
      this.runWasm();
      let endTime = this.performance.now();
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
      let startTime = this.performance.now();
      this.runJavaScript();
      let endTime = this.performance.now();
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
