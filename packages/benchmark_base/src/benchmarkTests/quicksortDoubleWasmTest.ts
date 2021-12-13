import { Modules, WasmTestBaseClass } from './index';

export default class quicksortDoubleWasmTest extends WasmTestBaseClass {
  dataSize: number;
  array0: Float64Array;
  array1: Float64Array;
  array2: Float64Array;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Modules,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, modules);
    this.dataSize = dataSize;
    this.array0 = new Float64Array(this.dataSize); // master
    this.array1 = new Float64Array(this.dataSize); // for JavaScript
    this.array2 = new Float64Array(this.dataSize); // for WebAssembly
    this.initTestData();
  }

  initTestData(): void {
    for (let i = 0, il = this.array0.length; i < il; i++) {
      this.array0[i] = Math.random() * 200 - 100;
    }
  }

  check(jsRes: any, wasmRes: any): boolean {
    function orderIsOk(array: Float64Array) {
      for (let i = 1, il = array.length; i < il; i++) {
        if (array[i - 1] > array[i]) return false;
      }
      return true;
    }
    if (!orderIsOk(this.array1)) return false;
    return this.equalArray(this.array1, this.array2);
  }

  getAllRunWasmFunc(): Array<Function> {
    const runCWasm = () => {
      const module = this.modules.cModule;

      this.copyArray(this.array0, this.array2);
      let pointer = module._malloc(this.array2.length * 8);
      let offset = pointer / 8;
      module.HEAPF64.set(this.array2, offset);
      module._quicksortDouble(pointer, 0, this.array2.length - 1);
      this.array2.set(
        module.HEAPF64.subarray(offset, offset + this.array2.length),
      );
      module._free(pointer);
    };
    return [runCWasm];
  }

  runJavaScript(): void {
    function jsQuicksortInt(array: Float64Array, start: number, end: number) {
      if (start >= end) return;
      let pivot = array[end];
      let left = 0;
      let right = 0;
      while (left + right < end - start) {
        let num = array[start + left];
        if (num < pivot) {
          left++;
        } else {
          array[start + left] = array[end - right - 1];
          array[end - right - 1] = pivot;
          array[end - right] = num;
          right++;
        }
      }
      jsQuicksortInt(array, start, start + left - 1);
      jsQuicksortInt(array, start + left + 1, end);
    }

    this.copyArray(this.array0, this.array1);
    jsQuicksortInt(this.array1, 0, this.array1.length - 1);
  }
}
