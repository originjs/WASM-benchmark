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
    const runRustWasm = () => {
      const module = this.modules.rustModule;

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

      function sum_double(array: any, n: any) {
        const ptr0 = passArrayF64ToWasm0(array, module.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = module.sum_double(ptr0, len0, n);
        return ret;
      }

      return sum_double(this.array, this.dataSize);
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

  runJavaScript(): number {
    let s = 0;
    for (let i = 0; i < this.dataSize; i++) {
      s += this.array[i];
    }
    return s;
  }
}
