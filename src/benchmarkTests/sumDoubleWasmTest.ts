import { WasmTestAbstractBaseClass } from './index';

export default class SumDoubleWasmTest extends WasmTestAbstractBaseClass {
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

  checkFunctionality(): boolean {
    return this.runWasm() === this.runJavaScript();
  }

  runWasm() {
    const pointer = this.module._malloc(this.array.length * 8);
    const offset = pointer / 8;
    this.module.HEAPF64.set(this.array, offset);
    const result = this.module._sumDouble(pointer, this.dataSize);
    this.module._free(pointer);
    return result;
  }

  runJavaScript(): number {
    let s = 0;
    for (let i = 0; i < this.dataSize; i++) {
      s += this.array[i];
    }
    return s;
  }
}
