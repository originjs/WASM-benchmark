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
    const { cModule, rustModule } = this.modules;

    const runCWasm = () => {
      let pointer1 = cModule._malloc(this.src1.length * 8);
      let pointer2 = cModule._malloc(this.src2.length * 8);
      let pointer3 = cModule._malloc(this.res2.length * 8);
      let offset1 = pointer1 / 8;
      let offset2 = pointer2 / 8;
      let offset3 = pointer3 / 8;
      cModule.HEAPF64.set(this.src1, offset1);
      cModule.HEAPF64.set(this.src2, offset2);
      cModule._multiplyDoubleVec(pointer1, pointer2, pointer3, this.dataSize);
      this.res2.set(cModule.HEAPF64.subarray(offset3, offset3 + this.dataSize));
      cModule._free(pointer1);
      cModule._free(pointer2);
      cModule._free(pointer3);
      return this.res2;
    };
    const runRustWasm = () => {
      let cachegetFloat64Memory0: any = null;
      function getFloat64Memory0() {
        if (
          cachegetFloat64Memory0 === null ||
          cachegetFloat64Memory0.buffer !== rustModule.memory.buffer
        ) {
          cachegetFloat64Memory0 = new Float64Array(rustModule.memory.buffer);
        }
        return cachegetFloat64Memory0;
      }

      let WASM_VECTOR_LEN = 0;

      function passArrayF64ToWasm0(arg: any, malloc: any) {
        const ptr = malloc(arg.length * 8);
        getFloat64Memory0().set(arg, ptr / 8);
        WASM_VECTOR_LEN = arg.length;
        return ptr;
      }

      function multiply_double_vec(src1: any, src2: any, res: any, n: any) {
        const ptr0 = passArrayF64ToWasm0(src1, rustModule.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(src2, rustModule.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(res, rustModule.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        rustModule.multiply_double_vec(ptr0, len0, ptr1, len1, ptr2, len2, n);
        res.set(getFloat64Memory0().subarray(ptr2 / 8, ptr2 / 8 + len2));
        rustModule.__wbindgen_free(ptr2, len2 * 8);
      }

      multiply_double_vec(this.src1, this.src2, this.res2, this.dataSize);
      return this.res2;
    };

    const allFunc: Array<Function> = [];
    if (cModule) {
      allFunc.push(runCWasm);
    }
    if (rustModule) {
      allFunc.push(runRustWasm);
    }
    return allFunc;
  }

  runJavaScript(): Float64Array {
    for (let i = 0; i < this.dataSize; i++) {
      this.res1[i] = this.src1[i] * this.src2[i];
    }
    return this.res1;
  }
}
