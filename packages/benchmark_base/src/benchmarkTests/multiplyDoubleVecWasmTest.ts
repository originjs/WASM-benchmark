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
    const runRustWasm = () => {
      let module = this.modules.rustModule;

      let cachegetFloat64Memory0: any = null;
      function getFloat64Memory0() {
        if (
          cachegetFloat64Memory0 === null ||
          cachegetFloat64Memory0.buffer !== module.memory.buffer
        ) {
          cachegetFloat64Memory0 = new Float64Array(module.memory.buffer);
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
        const ptr0 = passArrayF64ToWasm0(src1, module.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArrayF64ToWasm0(src2, module.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArrayF64ToWasm0(res, module.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        module.multiply_double_vec(ptr0, len0, ptr1, len1, ptr2, len2, n);
        res.set(getFloat64Memory0().subarray(ptr2 / 8, ptr2 / 8 + len2));
        module.__wbindgen_free(ptr2, len2 * 8);
      }

      multiply_double_vec(this.src1, this.src2, this.res2, this.dataSize);
      return this.res2;
    };

    const allFunc: Array<Function> = [];
    if (this.modules.cModule) {
      allFunc.push(runCWasm);
    }
    if (this.modules.rustModule) {
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
