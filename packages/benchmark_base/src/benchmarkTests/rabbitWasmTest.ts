import { Modules, WasmTestBaseClass } from './index';
// @ts-ignore
import wasmCryptoJS from '@originjs/crypto-js-wasm';
// @ts-ignore
import jsRabbit from 'crypto-js/rabbit';
// @ts-ignore
import core from 'crypto-js/core';

export default class RabbitWasmTest extends WasmTestBaseClass {
  dataSize: number;
  testStrings: Array<string> = [];
  testStringLength: number = 1024 * 1024;
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
  }

  static async initRustRabbit() {
    return await wasmCryptoJS.Rabbit.loadWasm();
  }

  initTestData() {
    for (let i = 0; i < this.dataSize; i++) {
      this.testStrings[i] = this.generateRandomString(this.testStringLength);
    }
  }

  runJavaScript(): Array<any> {
    for (let i = 0; i < this.dataSize; i++) {
      this.jsEncryptResult[i] = jsRabbit.encrypt(this.testStrings[i], this.key).toString();
      this.jsDecryptResult[i] = jsRabbit.decrypt(this.jsEncryptResult[i], this.key).toString(core.enc.Utf8);
    }

    return this.jsDecryptResult;
  }

  runRustWasm() {
    for (let i = 0; i < this.dataSize; i++) {
      this.rustEncryptResult[i] = wasmCryptoJS.Rabbit.encrypt(this.testStrings[i], this.key).toString();
      this.rustDecryptResult[i] = wasmCryptoJS.Rabbit.decrypt(this.rustEncryptResult[i], this.key).toString(wasmCryptoJS.enc.Utf8);
    }

    return this.rustDecryptResult;
  }
}
