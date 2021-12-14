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
    const { cModule, rustModule } = this.modules;

    const runCWasm = () => {
      const pointer = cModule._malloc(this.array.length * 4);
      const offset = pointer / 4;
      cModule.HEAP32.set(this.array, offset);
      const result = cModule._sumInt(pointer, this.dataSize);
      cModule._free(pointer);
      return result;
    };
    const runRustWasm = () => {
      let cachegetUint32Memory0: any = null;
      function getUint32Memory0() {
        if (
          cachegetUint32Memory0 === null ||
          cachegetUint32Memory0.buffer !== rustModule.memory.buffer
        ) {
          cachegetUint32Memory0 = new Uint32Array(rustModule.memory.buffer);
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

      function sum_int(array: any, n: any) {
        const ptr0 = passArray32ToWasm0(array, rustModule.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = rustModule.sum_int(ptr0, len0, n);
        return ret;
      }

      return sum_int(this.array, this.dataSize);
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

  runJavaScript(): number {
    let s = 0;
    for (let i = 0; i < this.dataSize; i++) {
      s += this.array[i];
    }
    return s;
  }
}
