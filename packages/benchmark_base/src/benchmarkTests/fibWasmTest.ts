import { Modules, WasmTestBaseClass } from './index';

export default class FibWasmTest extends WasmTestBaseClass {
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

    const runCWasm = () => cModule._fib(this.dataSize);
    const runRustWasm = () => rustModule.fib(this.dataSize);

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
    function jsFib(n: number): number {
      if (n === 1) return 1;
      if (n === 2) return 1;
      return jsFib(n - 1) + jsFib(n - 2);
    }

    return jsFib(this.dataSize);
  }
}
