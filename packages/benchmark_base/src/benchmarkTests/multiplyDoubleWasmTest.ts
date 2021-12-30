import { Modules, WasmTestBaseClass } from './index';

export default class MultiplyDoubleWasmTest extends WasmTestBaseClass {
  dataSize: number;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Modules,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, modules);
    this.dataSize = dataSize;
  }

  runCWasm() {
    return this.modules.cModule._multiplyDouble(1.0, 1.0, this.dataSize);
  }

  runRustWasm() {
    return this.modules.rustModule.multiply_double(1.0, 1.0, this.dataSize);
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
