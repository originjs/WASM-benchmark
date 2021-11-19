import { WasmTestAbstractBaseClass } from './index';

export default class MultiplyDoubleWasmTest extends WasmTestAbstractBaseClass {
  dataSize: number;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    module: Object,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, module);
    this.dataSize = dataSize;
  }

  checkFunctionality(): boolean {
    return this.runWasm() === this.runJavaScript();
  }

  runWasm(): number {
    return this.module._multiplyDouble(1.0, 1.0, this.dataSize);
  }

  runJavaScript(): number {
    function jsMultiplyDouble(a: number, b: number, n: number) {
      let c = 1.0;
      for (let i = 0; i < n; i++) {
        c = c * a * b;
      }
      return c;
    }

    return jsMultiplyDouble(1.0, 1.0, this.dataSize);
  }
}
