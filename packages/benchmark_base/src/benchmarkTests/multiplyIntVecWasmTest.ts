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
    const runRustWasm = () => {
      const module = this.modules.rustModule;

      let cachegetUint32Memory0: any = null;
      function getUint32Memory0() {
        if (
          cachegetUint32Memory0 === null ||
          cachegetUint32Memory0.buffer !== module.memory.buffer
        ) {
          cachegetUint32Memory0 = new Uint32Array(module.memory.buffer);
        }
        return cachegetUint32Memory0;
      }

      let WASM_VECTOR_LEN = 0;

      function passArray32ToWasm0(arg: any, malloc: any) {
        const ptr = malloc(arg.length * 4);
        getUint32Memory0().set(arg, ptr / 4);
        WASM_VECTOR_LEN = arg.length;
        return ptr;
      }

      let cachegetInt32Memory0: any = null;
      function getInt32Memory0() {
        if (
          cachegetInt32Memory0 === null ||
          cachegetInt32Memory0.buffer !== module.memory.buffer
        ) {
          cachegetInt32Memory0 = new Int32Array(module.memory.buffer);
        }
        return cachegetInt32Memory0;
      }

      function multiply_int_vec(src1: any, src2: any, res: any, n: any) {
        const ptr0 = passArray32ToWasm0(src1, module.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray32ToWasm0(src2, module.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passArray32ToWasm0(res, module.__wbindgen_malloc);
        const len2 = WASM_VECTOR_LEN;
        module.multiply_int_vec(ptr0, len0, ptr1, len1, ptr2, len2, n);
        res.set(getInt32Memory0().subarray(ptr2 / 4, ptr2 / 4 + len2));
        module.__wbindgen_free(ptr2, len2 * 4);
      }

      multiply_int_vec(this.src1, this.src2, this.res2, this.dataSize);
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

  runJavaScript(): Int32Array {
    for (let i = 0; i < this.dataSize; i++) {
      this.res1[i] = this.src1[i] * this.src2[i];
    }
    return this.res1;
  }
}
