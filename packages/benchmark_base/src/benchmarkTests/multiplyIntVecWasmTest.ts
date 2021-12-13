import { Modules, WasmTestBaseClass } from './index';

export default class MultiplyIntVecWasmTest extends WasmTestBaseClass {
  dataSize: number;
  src1: Int32Array;
  src2: Int32Array;
  res1: Int32Array;
  res2: Int32Array;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Modules,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, modules);
    this.dataSize = dataSize;
    this.src1 = new Int32Array(this.dataSize);
    this.src2 = new Int32Array(this.dataSize);
    this.res1 = new Int32Array(this.dataSize);
    this.res2 = new Int32Array(this.dataSize);
    this.initTestData();
  }

  initTestData() {
    function initArray(array: Int32Array) {
      for (let i = 0, il = array.length; i < il; i++) {
        array[i] = ((Math.random() * 20000) | 0) - 10000;
      }
    }
    initArray(this.src1);
    initArray(this.src2);
  }

  getAllRunWasmFunc(): Array<Function> {
    const runCWasm = () => {
      const module = this.modules.cModule;

      let pointer1 = module._malloc(this.src1.length * 4);
      let pointer2 = module._malloc(this.src2.length * 4);
      let pointer3 = module._malloc(this.dataSize * 4);
      let offset1 = pointer1 / 4;
      let offset2 = pointer2 / 4;
      let offset3 = pointer3 / 4;
      module.HEAP32.set(this.src1, offset1);
      module.HEAP32.set(this.src2, offset2);
      module._multiplyIntVec(pointer1, pointer2, pointer3, this.dataSize);
      this.res2.set(module.HEAP32.subarray(offset3, offset3 + this.dataSize));
      module._free(pointer1);
      module._free(pointer2);
      module._free(pointer3);
      return this.res2;
    };
    return [runCWasm];
  }

  runJavaScript(): Int32Array {
    for (let i = 0; i < this.dataSize; i++) {
      this.res1[i] = this.src1[i] * this.src2[i];
    }
    return this.res1;
  }
}
