import { Modules, WasmTestBaseClass } from './index';

export default class MultiplyDoubleVecWasmTest extends WasmTestBaseClass {
  dataSize: number;
  src1: Float64Array;
  src2: Float64Array;
  res1: Float64Array;
  res2: Float64Array;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Modules,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, modules);
    this.dataSize = dataSize;
    this.src1 = new Float64Array(this.dataSize);
    this.src2 = new Float64Array(this.dataSize);
    this.res1 = new Float64Array(this.dataSize);
    this.res2 = new Float64Array(this.dataSize);
    this.initTestData();
  }

  initTestData() {
    function initArray(array: Float64Array) {
      for (let i = 0, il = array.length; i < il; i++) {
        array[i] = Math.random() * 20000 - 10000;
      }
    }
    initArray(this.src1);
    initArray(this.src2);
  }

  getAllRunWasmFunc(): Array<Function> {
    const runCWasm = () => {
      const module = this.modules.cModule;

      let pointer1 = module._malloc(this.src1.length * 8);
      let pointer2 = module._malloc(this.src2.length * 8);
      let pointer3 = module._malloc(this.res2.length * 8);
      let offset1 = pointer1 / 8;
      let offset2 = pointer2 / 8;
      let offset3 = pointer3 / 8;
      module.HEAPF64.set(this.src1, offset1);
      module.HEAPF64.set(this.src2, offset2);
      module._multiplyDoubleVec(pointer1, pointer2, pointer3, this.dataSize);
      this.res2.set(module.HEAPF64.subarray(offset3, offset3 + this.dataSize));
      module._free(pointer1);
      module._free(pointer2);
      module._free(pointer3);
      return this.res2;
    };
    return [runCWasm];
  }

  runJavaScript(): Float64Array {
    for (let i = 0; i < this.dataSize; i++) {
      this.res1[i] = this.src1[i] * this.src2[i];
    }
    return this.res1;
  }
}
