// @ts-ignore
import collisionDetectionModule from '../../c_glue_files/collisionDetection';
import collisionDetectionWasmTest from '../../../benchmark_base/src/benchmarkTests/collisionDetectionWasmTest';
// @ts-ignore
import fibModule from '../../c_glue_files/fib';
import fibWasmTest from '../../../benchmark_base/src/benchmarkTests/fibWasmTest';
// @ts-ignore
import multiplyDoubleModule from '../../c_glue_files/multiplyDouble';
import multiplyDoubleWasmTest from '../../../benchmark_base/src/benchmarkTests/multiplyDoubleWasmTest';
// @ts-ignore
import multiplyIntVecModule from '../../c_glue_files/multiplyIntVec';
import multiplyIntVecWasmTest from '../../../benchmark_base/src/benchmarkTests/multiplyIntVecWasmTest';
// @ts-ignore
import multiplyDoubleVecModule from '../../c_glue_files/multiplyDoubleVec';
import multiplyDoubleVecWasmTest from '../../../benchmark_base/src/benchmarkTests/multiplyDoubleVecWasmTest';
// @ts-ignore
import quicksortIntModule from '../../c_glue_files/quicksortInt';
import quicksortIntWasmTest from '../../../benchmark_base/src/benchmarkTests/quicksortIntWasmTest';
// @ts-ignore
import quicksortDoubleModule from '../../c_glue_files/quicksortDouble';
import quicksortDoubleWasmTest from '../../../benchmark_base/src/benchmarkTests/quicksortDoubleWasmTest';
// @ts-ignore
import sumIntModule from '../../c_glue_files/sumInt';
import sumIntWasmTest from '../../../benchmark_base/src/benchmarkTests/sumIntWasmTest';
// @ts-ignore
import sumDoubleModule from '../../c_glue_files/sumDouble';
import sumDoubleWasmTest from '../../../benchmark_base/src/benchmarkTests/sumDoubleWasmTest';

export type BenchmarkDatasets = {
  [testName: string]: any;
};

const benchmarkDatasets: BenchmarkDatasets = {
  collisionDetection: {
    cGlueFunc: collisionDetectionModule,
    cWasmUrl: './c_wasm_files/collisionDetection.wasm',
    testbench: collisionDetectionWasmTest,
    dataSize: 0x4000,
  },
  fibonacci: {
    cGlueFunc: fibModule,
    cWasmUrl: './c_wasm_files/fib.wasm',
    testbench: fibWasmTest,
    dataSize: 0x28,
  },
  multiplyDouble: {
    cGlueFunc: multiplyDoubleModule,
    cWasmUrl: './c_wasm_files/multiplyDouble.wasm',
    testbench: multiplyDoubleWasmTest,
    dataSize: 0x10000000,
  },
  multiplyIntVec: {
    cGlueFunc: multiplyIntVecModule,
    cWasmUrl: './c_wasm_files/multiplyIntVec.wasm',
    testbench: multiplyIntVecWasmTest,
    dataSize: 0x2000000,
  },
  multiplyDoubleVec: {
    cGlueFunc: multiplyDoubleVecModule,
    cWasmUrl: './c_wasm_files/multiplyDoubleVec.wasm',
    testbench: multiplyDoubleVecWasmTest,
    dataSize: 0x2000000,
  },
  quicksortInt: {
    cGlueFunc: quicksortIntModule,
    cWasmUrl: './c_wasm_files/quicksortInt.wasm',
    testbench: quicksortIntWasmTest,
    dataSize: 0x200000,
  },
  quicksortDouble: {
    cGlueFunc: quicksortDoubleModule,
    cWasmUrl: './c_wasm_files/quicksortDouble.wasm',
    testbench: quicksortDoubleWasmTest,
    dataSize: 0x200000,
  },
  sumInt: {
    cGlueFunc: sumIntModule,
    cWasmUrl: './c_wasm_files/sumInt.wasm',
    testbench: sumIntWasmTest,
    dataSize: 0x8000000,
  },
  sumDouble: {
    cGlueFunc: sumDoubleModule,
    cWasmUrl: './c_wasm_files/sumDouble.wasm',
    testbench: sumDoubleWasmTest,
    dataSize: 0x4000000,
  },
};

export default benchmarkDatasets;
