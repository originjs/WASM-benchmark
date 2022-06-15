import { Modules, WasmTestBaseClass } from './index';
// @ts-ignore
import wasmCryptoJS from '@originjs/crypto-js-wasm';
// @ts-ignore
import jsMd5 from 'crypto-js/md5';

export default class Md5WasmTest extends WasmTestBaseClass {
  dataSize: number;
  testStrings: Array<string> = [];
  testStringLength: number = 1024 * 1024 * 10;
  javascriptResult: Array<String> = [];
  wasmResult: Array<String> = [];
  md5: any;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Modules,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, modules);
    this.dataSize = dataSize;

    this.initTestData();
  }

  static async initRustMd5() {
    return await wasmCryptoJS.MD5.loadWasm();
  }

  initTestData() {
    for (let i = 0; i < this.dataSize; i++) {
      this.testStrings[i] = this.generateRandomString(this.testStringLength);
    }
  }

  check(jsRes: any, wasmRes: any) {
    return this.equalArray(this.javascriptResult, this.wasmResult);
  }

  runJavaScript(): void {
    for (let i = 0; i < this.dataSize; i++) {
      this.javascriptResult[i] = jsMd5(this.testStrings[i]).toString();
    }
  }

  async runRustWasm() {
    for (let i = 0; i < this.dataSize; i++) {
      this.wasmResult[i] = wasmCryptoJS.MD5(this.testStrings[i]).toString();
    }
  }

  clearArray(array: Array<String>): void {
    for (let i = 0, il = array.length; i < il; i++) {
      array[i] = '';
    }
  }
}
