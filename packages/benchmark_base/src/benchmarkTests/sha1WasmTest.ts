import { Modules, WasmTestBaseClass } from './index';
import wasmCryptoJS from '@originjs/crypto-js-wasm';
// @ts-ignore
import jsSha1 from 'crypto-js/sha1';

export default class Sha1WasmTest extends WasmTestBaseClass {
  dataSize: number;
  testStrings: Array<string> = [];
  testStringLength: number = 1024 * 1024 * 10;
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

  static async initRustSha1() {
    return await wasmCryptoJS.SHA1.loadWasm();
  }

  initTestData() {
    for (let i = 0; i < this.dataSize; i++) {
      this.testStrings[i] = this.generateRandomString(this.testStringLength);
    }
  }

  runJavaScript(): Array<any> {
    for (let i = 0; i < this.dataSize; i++) {
      this.javascriptResult[i] = jsSha1(this.testStrings[i]).toString();
    }

    return this.javascriptResult;
  }

  runRustWasm() {
    for (let i = 0; i < this.dataSize; i++) {
      this.wasmResult[i] = wasmCryptoJS.SHA1(this.testStrings[i]).toString();
    }

    return this.wasmResult;
  }
}
