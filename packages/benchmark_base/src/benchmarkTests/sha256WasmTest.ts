import { Modules, WasmTestBaseClass } from './index';
import wasmCryptoJS from '@originjs/crypto-js-wasm';
// @ts-ignore
import jsSha256 from 'crypto-js/sha256';

export default class Sha256WasmTest extends WasmTestBaseClass {
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

  static async initRustSha256() {
    return await wasmCryptoJS.SHA256.loadWasm();
  }

  initTestData() {
    for (let i = 0; i < this.dataSize; i++) {
      this.testStrings[i] = this.generateRandomString(this.testStringLength);
    }
  }

  runJavaScript(): Array<any> {
    for (let i = 0; i < this.dataSize; i++) {
      this.javascriptResult[i] = jsSha256(this.testStrings[i]).toString();
    }

    return this.javascriptResult;
  }

  runRustWasm() {
    for (let i = 0; i < this.dataSize; i++) {
      this.wasmResult[i] = wasmCryptoJS.SHA256(this.testStrings[i]).toString();
    }

    return this.wasmResult;
  }
}
