// @ts-ignore
import collisionDetectionModule from '../c_glue_files/collisionDetection';
import collisionDetectionWasmTest from '../../benchmark_base/src/benchmarkTests/collisionDetectionWasmTest';
// @ts-ignore
import fibModule from '../c_glue_files/fib';
import fibWasmTest from '../../benchmark_base/src/benchmarkTests/fibWasmTest';
// @ts-ignore
import multiplyDoubleModule from '../c_glue_files/multiplyDouble';
import multiplyDoubleWasmTest from '../../benchmark_base/src/benchmarkTests/multiplyDoubleWasmTest';
// @ts-ignore
import multiplyIntVecModule from '../c_glue_files/multiplyIntVec';
import multiplyIntVecWasmTest from '../../benchmark_base/src/benchmarkTests/multiplyIntVecWasmTest';
// @ts-ignore
import multiplyDoubleVecModule from '../c_glue_files/multiplyDoubleVec';
import multiplyDoubleVecWasmTest from '../../benchmark_base/src/benchmarkTests/multiplyDoubleVecWasmTest';
// @ts-ignore
import quicksortIntModule from '../c_glue_files/quicksortInt';
import quicksortIntWasmTest from '../../benchmark_base/src/benchmarkTests/quicksortIntWasmTest';
// @ts-ignore
import quicksortDoubleModule from '../c_glue_files/quicksortDouble';
import quicksortDoubleWasmTest from '../../benchmark_base/src/benchmarkTests/quicksortDoubleWasmTest';
// @ts-ignore
import sumIntModule from '../c_glue_files/sumInt';
import sumIntWasmTest from '../../benchmark_base/src/benchmarkTests/sumIntWasmTest';
// @ts-ignore
import sumDoubleModule from '../c_glue_files/sumDouble';
import sumDoubleWasmTest from '../../benchmark_base/src/benchmarkTests/sumDoubleWasmTest';
import { join } from 'path';
import md5WasmTest from "../../benchmark_base/src/benchmarkTests/md5WasmTest";
import sha1WasmTest from "../../benchmark_base/src/benchmarkTests/sha1WasmTest";
import sha256WasmTest from "../../benchmark_base/src/benchmarkTests/sha256WasmTest";
import sha224WasmTest from "../../benchmark_base/src/benchmarkTests/sha224WasmTest";
import sha512WasmTest from "../../benchmark_base/src/benchmarkTests/sha512WasmTest";
import sha384WasmTest from "../../benchmark_base/src/benchmarkTests/sha384WasmTest";
import sha3WasmTest from "../../benchmark_base/src/benchmarkTests/sha3WasmTest";
import aesWasmTest from "../../benchmark_base/src/benchmarkTests/aesWasmTest";
import desWasmTest from "../../benchmark_base/src/benchmarkTests/desWasmTest";
import tripleDesWasmTest from "../../benchmark_base/src/benchmarkTests/tripleDesWasmTest";
import rabbitWasmTest from "../../benchmark_base/src/benchmarkTests/rabbitWasmTest";
import rc4WasmTest from "../../benchmark_base/src/benchmarkTests/rc4WasmTest";
import ripemd160WasmTest from "../../benchmark_base/src/benchmarkTests/ripemd160WasmTest";

export type BenchmarkDatasets = {
  [testName: string]: any;
};

// @ts-ignore
const benchmarkDatasets: BenchmarkDatasets = {
  collisionDetection: {
    cGlueFunc: collisionDetectionModule,
    cWasmUrl: join(__dirname, '../c_wasm_files/collisionDetection.wasm'),
    rustWasmUrl: join(
      __dirname,
      '../rust_wasm_files/collisionDetectionRust.js',
    ),
    testbench: collisionDetectionWasmTest,
    dataSize: 0x4000,
  },
  fibonacci: {
    cGlueFunc: fibModule,
    cWasmUrl: join(__dirname, '../c_wasm_files/fib.wasm'),
    rustWasmUrl: join(__dirname, '../rust_wasm_files/fibRust.js'),
    testbench: fibWasmTest,
    dataSize: 0x28,
  },
  multiplyDouble: {
    cGlueFunc: multiplyDoubleModule,
    cWasmUrl: join(__dirname, '../c_wasm_files/multiplyDouble.wasm'),
    rustWasmUrl: join(__dirname, '../rust_wasm_files/multiplyDoubleRust.js'),
    testbench: multiplyDoubleWasmTest,
    dataSize: 0x10000000,
  },
  multiplyIntVec: {
    cGlueFunc: multiplyIntVecModule,
    cWasmUrl: join(__dirname, '../c_wasm_files/multiplyIntVec.wasm'),
    rustWasmUrl: join(__dirname, '../rust_wasm_files/multiplyIntVecRust.js'),
    testbench: multiplyIntVecWasmTest,
    dataSize: 0x2000000,
  },
  multiplyDoubleVec: {
    cGlueFunc: multiplyDoubleVecModule,
    cWasmUrl: join(__dirname, '../c_wasm_files/multiplyDoubleVec.wasm'),
    rustWasmUrl: join(__dirname, '../rust_wasm_files/multiplyDoubleVecRust.js'),
    testbench: multiplyDoubleVecWasmTest,
    dataSize: 0x2000000,
  },
  quicksortInt: {
    cGlueFunc: quicksortIntModule,
    cWasmUrl: join(__dirname, '../c_wasm_files/quicksortInt.wasm'),
    testbench: quicksortIntWasmTest,
    dataSize: 0x200000,
  },
  quicksortDouble: {
    cGlueFunc: quicksortDoubleModule,
    cWasmUrl: join(__dirname, '../c_wasm_files/quicksortDouble.wasm'),
    testbench: quicksortDoubleWasmTest,
    dataSize: 0x200000,
  },
  sumInt: {
    cGlueFunc: sumIntModule,
    cWasmUrl: join(__dirname, '../c_wasm_files/sumInt.wasm'),
    rustWasmUrl: join(__dirname, '../rust_wasm_files/sumIntRust.js'),
    testbench: sumIntWasmTest,
    dataSize: 0x8000000,
  },
  sumDouble: {
    cGlueFunc: sumDoubleModule,
    cWasmUrl: join(__dirname, '../c_wasm_files/sumDouble.wasm'),
    rustWasmUrl: join(__dirname, '../rust_wasm_files/sumDoubleRust.js'),
    testbench: sumDoubleWasmTest,
    dataSize: 0x4000000,
  },
  md5: {
    rustWasmLoad: md5WasmTest.initRustMd5,
    testbench: md5WasmTest,
    dataSize: 0x0001,
  },
  sha1: {
    rustWasmLoad: sha1WasmTest.initRustSha1,
    testbench: sha1WasmTest,
    dataSize: 0x0001,
  },
  sha256: {
    rustWasmLoad: sha256WasmTest.initRustSha256,
    testbench: sha256WasmTest,
    dataSize: 0x0001,
  },
  sha224: {
    rustWasmLoad: sha224WasmTest.initRustSha224,
    testbench: sha224WasmTest,
    dataSize: 0x0001,
  },
  sha512: {
    rustWasmLoad: sha512WasmTest.initRustSha512,
    testbench: sha512WasmTest,
    dataSize: 0x0001,
  },
  sha384: {
    rustWasmLoad: sha384WasmTest.initRustSha384,
    testbench: sha384WasmTest,
    dataSize: 0x0001,
  },
  sha3: {
    rustWasmLoad: sha3WasmTest.initRustSha3,
    testbench: sha3WasmTest,
    dataSize: 0x0001,
  },
  aes: {
    rustWasmLoad: aesWasmTest.initRustAes,
    testbench: aesWasmTest,
    dataSize: 0x0001,
  },
  des: {
    rustWasmLoad: desWasmTest.initRustDes,
    testbench: desWasmTest,
    dataSize: 0x0001,
  },
  tripledes: {
    rustWasmLoad: tripleDesWasmTest.initRustTripleDes,
    testbench: tripleDesWasmTest,
    dataSize: 0x0001,
  },
  rabbit: {
    rustWasmLoad: rabbitWasmTest.initRustRabbit,
    testbench: rabbitWasmTest,
    dataSize: 0x0001,
  },
  rc4: {
    rustWasmLoad: rc4WasmTest.initRustRC4,
    testbench: rc4WasmTest,
    dataSize: 0x0001,
  },
  ripemd160: {
    rustWasmLoad: ripemd160WasmTest.initRustRipemd160,
    testbench: ripemd160WasmTest,
    dataSize: 0x0001,
  },
};

export default benchmarkDatasets;
