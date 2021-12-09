import { Modules, WasmTestBaseClass } from './index';

export default class SumIntWasmTest extends WasmTestBaseClass {
  array: Int32Array;
  dataSize: number;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Modules,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, modules);
    this.dataSize = dataSize;
    this.array = new Int32Array(this.dataSize);
    this.initTestData();
  }

  initTestData(): void {
    for (let i = 0, il = this.array.length; i < il; i++) {
      this.array[i] = ((Math.random() * 20000) | 0) - 10000;
    }
  }

  getAllRunWasmFunc(): Array<Function> {
    const runCWasm = () => {
      const module = this.modules.cModule;

      const pointer = module._malloc(this.array.length * 4);
      const offset = pointer / 4;
      module.HEAP32.set(this.array, offset);
      const result = module._sumInt(pointer, this.dataSize);
      module._free(pointer);
      return result;
    };
    return [runCWasm];
  }

  runJavaScript(): number {
    let s = 0;
    for (let i = 0; i < this.dataSize; i++) {
      s += this.array[i];
    }
    return s;
  }
}
