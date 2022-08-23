import { Modules, WasmTestBaseClass } from './index';
import wasmCryptoJS from '@originjs/crypto-js-wasm';
// @ts-ignore
import jsRc4 from 'crypto-js/rc4';
// @ts-ignore
import core from 'crypto-js/core';

export default class Rc4WasmTest extends WasmTestBaseClass {
  dataSize: number;
  testStrings: Array<string> = [];
  testStringLength: number = 1024 * 1024;
  jsEncryptResult: Array<string> = [];
  jsDecryptResult: Array<string> = [];
  rustEncryptResult: Array<string> = [];
  rustDecryptResult: Array<string> = [];
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
  }

  static async initRustRC4() {
    return await wasmCryptoJS.RC4.loadWasm();
  }

  initTestData() {
    for (let i = 0; i < this.dataSize; i++) {
      this.testStrings[i] = this.generateRandomString(this.testStringLength);
    }
  }

  runJavaScript(): Array<any> {
    for (let i = 0; i < this.dataSize; i++) {
      this.jsEncryptResult[i] = jsRc4.encrypt(this.testStrings[i], this.key).toString();
      this.jsDecryptResult[i] = jsRc4.decrypt(this.jsEncryptResult[i], this.key).toString(core.enc.Utf8);
    }

    return this.jsDecryptResult;
  }

  runRustWasm() {
    for (let i = 0; i < this.dataSize; i++) {
      this.rustEncryptResult[i] = wasmCryptoJS.RC4.encrypt(this.testStrings[i], this.key).toString();
      this.rustDecryptResult[i] = wasmCryptoJS.RC4.decrypt(this.rustEncryptResult[i], this.key).toString(wasmCryptoJS.enc.Utf8);
    }

    return this.rustDecryptResult;
  }
}
