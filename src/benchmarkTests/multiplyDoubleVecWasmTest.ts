import { WasmTestAbstractBaseClass } from './index';

export default class MultiplyDoubleVecWasmTest extends WasmTestAbstractBaseClass {
  dataSize: number;
  src1: Float64Array;
  src2: Float64Array;
  res1: Float64Array;
  res2: Float64Array;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    module: Object,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, module);
    this.dataSize = dataSize;
    this.src1 = new Float64Array(this.dataSize);
    this.src2 = new Float64Array(this.dataSize);
    this.res1 = new Float64Array(this.dataSize);
    this.res2 = new Float64Array(this.dataSize);
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

  checkFunctionality(): boolean {
    function equalArray(array1: Float64Array, array2: Float64Array) {
      if (array1.length !== array2.length) return false;
      for (let i = 0, il = array1.length; i < il; i++) {
        if (array1[i] !== array2[i]) return false;
      }
      return true;
    }
    this.runWasm();
    this.runJavaScript();
    return equalArray(this.res1, this.res2);
  }

  runWasm(): void {
    let pointer1 = this.module._malloc(this.src1.length * 8);
    let pointer2 = this.module._malloc(this.src2.length * 8);
    let pointer3 = this.module._malloc(this.res2.length * 8);
    let offset1 = pointer1 / 8;
    let offset2 = pointer2 / 8;
    let offset3 = pointer3 / 8;
    this.module.HEAPF64.set(this.src1, offset1);
    this.module.HEAPF64.set(this.src2, offset2);
    this.module._multiplyDoubleVec(pointer1, pointer2, pointer3, this.dataSize);
    this.res2.set(
      this.module.HEAPF64.subarray(offset3, offset3 + this.dataSize),
    );
    this.module._free(pointer1);
    this.module._free(pointer2);
    this.module._free(pointer3);
  }

  runJavaScript(): void {
    for (let i = 0; i < this.dataSize; i++) {
      this.res1[i] = this.src1[i] * this.src2[i];
    }
  }
}
