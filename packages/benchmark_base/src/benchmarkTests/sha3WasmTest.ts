import { Modules, WasmTestBaseClass } from './index';
import wasmCryptoJS from '@originjs/crypto-js-wasm';
// @ts-ignore
import jsSha3 from 'crypto-js/sha3';

export default class Sha3WasmTest extends WasmTestBaseClass {
  dataSize: number;
  testStrings: Array<string> = [];
  testStringLength: number = 1024 * 1024;
  javascriptResult: Array<string> = [];
  wasmResult: Array<string> = [];

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

  static async initRustSha3() {
    return await wasmCryptoJS.SHA3.loadWasm();
  }

  initTestData() {
    for (let i = 0; i < this.dataSize; i++) {
      this.testStrings[i] = this.generateRandomString(this.testStringLength);
    }
  }

  runJavaScript(): Array<any> {
    for (let i = 0; i < this.dataSize; i++) {
      this.javascriptResult[i] = jsSha3(this.testStrings[i]).toString();
    }

    return this.javascriptResult;
  }

  runRustWasm() {
    for (let i = 0; i < this.dataSize; i++) {
      this.wasmResult[i] = wasmCryptoJS.SHA3(this.testStrings[i]).toString();
    }

    return this.wasmResult;
  }
}
