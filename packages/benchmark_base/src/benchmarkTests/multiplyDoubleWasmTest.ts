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

  getAllRunWasmFunc(): Array<Function> {
    const { cModule, rustModule } = this.modules;

    const runCWasm = () => cModule._multiplyDouble(1.0, 1.0, this.dataSize);
    const runRustWasm = () =>
      rustModule.multiply_double(1.0, 1.0, this.dataSize);

    const allFunc: Array<Function> = [];
    if (cModule) {
      allFunc.push(runCWasm);
    }
    if (rustModule) {
      allFunc.push(runRustWasm);
    }
    return allFunc;
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
