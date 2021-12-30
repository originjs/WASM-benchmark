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

  runCWasm() {
    return this.modules.cModule._fib(this.dataSize);
  }

  runRustWasm() {
    return this.modules.rustModule.fib(this.dataSize);
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
