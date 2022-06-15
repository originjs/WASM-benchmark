import { Modules, WasmTestBaseClass } from './index';
// @ts-ignore
import wasmCryptoJS from '@originjs/crypto-js-wasm';
// @ts-ignore
import jsCryptoJS from 'crypto-js/crypto-js';

export default class DesWasmTest extends WasmTestBaseClass {
  dataSize: number;
  testStrings: Array<string> = [];
  testStringLength: number = 1024 * 100;
  jsEncryptResult: Array<String> = [];
  jsDecryptResult: Array<String> = [];
  rustEncryptResult: Array<String> = [];
  rustDecryptResult: Array<String> = [];
  key: string;

  constructor(
    dataSize: number,
    warmUpRunLoops: number,
    benchmarkRunLoops: number,
    modules: Modules,
  ) {
    super(warmUpRunLoops, benchmarkRunLoops, modules);
    this.dataSize = dataSize;
    this.key = "key";

    this.initTestData();
    this.initRustDes();
  }

  async initRustDes() {
    return await wasmCryptoJS.DES.loadWasm();
  }

  static async initRustDes() {
    return await wasmCryptoJS.DES.loadWasm();
  }

  initTestData() {
    for (let i = 0; i < this.dataSize; i++) {
      this.testStrings[i] = this.generateRandomString(this.testStringLength);
    }
  }

  runJavaScript(): Array<any> {
    for (let i = 0; i < this.dataSize; i++) {
      this.jsEncryptResult[i] = jsCryptoJS.DES.encrypt(this.testStrings[i], this.key).toString();
      this.jsDecryptResult[i] = jsCryptoJS.DES.decrypt(this.jsEncryptResult[i], this.key).toString(jsCryptoJS.enc.Utf8);
    }

    return this.jsDecryptResult;
  }

  runRustWasm() {
    for (let i = 0; i < this.dataSize; i++) {
      this.rustEncryptResult[i] = wasmCryptoJS.DES.encrypt(this.testStrings[i], this.key).toString();
      this.rustDecryptResult[i] = wasmCryptoJS.DES.decrypt(this.rustEncryptResult[i], this.key).toString(wasmCryptoJS.enc.Utf8);
    }

    return this.rustDecryptResult;
  }
}
