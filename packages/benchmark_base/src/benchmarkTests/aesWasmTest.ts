import { Modules, WasmTestBaseClass } from './index';
// @ts-ignore
import wasmCryptoJS from '@originjs/crypto-js-wasm';
// @ts-ignore
import jsAes from 'crypto-js/aes';
// @ts-ignore
import core from 'crypto-js/core';

export default class AesWasmTest extends WasmTestBaseClass {
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

  static async initRustAes() {
    return await wasmCryptoJS.AES.loadWasm();
  }

  initTestData() {
    for (let i = 0; i < this.dataSize; i++) {
      this.testStrings[i] = this.generateRandomString(this.testStringLength);
    }
  }

  runJavaScript(): Array<any> {
    for (let i = 0; i < this.dataSize; i++) {
      this.jsEncryptResult[i] = jsAes.encrypt(this.testStrings[i], this.key).toString();
      this.jsDecryptResult[i] = jsAes.decrypt(this.jsEncryptResult[i], this.key).toString(core.enc.Utf8);
    }

    return this.jsDecryptResult;
  }

  runRustWasm() {
    for (let i = 0; i < this.dataSize; i++) {
      this.rustEncryptResult[i] = wasmCryptoJS.AES.encrypt(this.testStrings[i], this.key).toString();
      this.rustDecryptResult[i] = wasmCryptoJS.AES.decrypt(this.rustEncryptResult[i], this.key).toString(wasmCryptoJS.enc.Utf8);
    }

    return this.rustDecryptResult;
  }
}
