import { WasmTestBaseClass } from './index';

export default class SumDoubleWasmTest extends WasmTestBaseClass {
  array: Float64Array;
  dataSize: number;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    module: Object,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, module);
    this.dataSize = dataSize;
    this.array = new Float64Array(this.dataSize);
    this.initTestData();
  }

  initTestData() {
    for (let i = 0, il = this.array.length; i < il; i++) {
      this.array[i] = Math.random() * 20000 - 10000;
    }
  }

  getAllRunWasmFunc(): Array<Function> {
    const runCWasm = () => {
      const module = this.modules.cModule;

      const pointer = module._malloc(this.array.length * 8);
      const offset = pointer / 8;
      module.HEAPF64.set(this.array, offset);
      const result = module._sumDouble(pointer, this.dataSize);
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
