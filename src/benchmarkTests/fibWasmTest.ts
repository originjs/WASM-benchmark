import { WasmTestAbstractBaseClass } from './index';

export default class FibWasmTest extends WasmTestAbstractBaseClass {
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

  runWasm() {
    return this.module._fib(this.dataSize);
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
