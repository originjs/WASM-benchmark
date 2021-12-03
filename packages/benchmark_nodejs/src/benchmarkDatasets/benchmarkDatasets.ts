// @ts-ignore
import collisionDetectionModule from '../../browser_benchmark/collisionDetection';
import collisionDetectionWasmTest from '../../../benchmark_base/src/benchmarkTests/collisionDetectionWasmTest';
// @ts-ignore
import fibModule from '../../browser_benchmark/fib';
import fibWasmTest from '../../../benchmark_base/src/benchmarkTests/fibWasmTest';
// @ts-ignore
import multiplyDoubleModule from '../../browser_benchmark/multiplyDouble';
import multiplyDoubleWasmTest from '../../../benchmark_base/src/benchmarkTests/multiplyDoubleWasmTest';
// @ts-ignore
import multiplyIntVecModule from '../../browser_benchmark/multiplyIntVec';
import multiplyIntVecWasmTest from '../../../benchmark_base/src/benchmarkTests/multiplyIntVecWasmTest';
// @ts-ignore
import multiplyDoubleVecModule from '../../browser_benchmark/multiplyDoubleVec';
import multiplyDoubleVecWasmTest from '../../../benchmark_base/src/benchmarkTests/multiplyDoubleVecWasmTest';
// @ts-ignore
import quicksortIntModule from '../../browser_benchmark/quicksortInt';
import quicksortIntWasmTest from '../../../benchmark_base/src/benchmarkTests/quicksortIntWasmTest';
// @ts-ignore
import quicksortDoubleModule from '../../browser_benchmark/quicksortDouble';
import quicksortDoubleWasmTest from '../../../benchmark_base/src/benchmarkTests/quicksortDoubleWasmTest';
// @ts-ignore
import sumIntModule from '../../browser_benchmark/sumInt';
import sumIntWasmTest from '../../../benchmark_base/src/benchmarkTests/sumIntWasmTest';
// @ts-ignore
import sumDoubleModule from '../../browser_benchmark/sumDouble';
import sumDoubleWasmTest from '../../../benchmark_base/src/benchmarkTests/sumDoubleWasmTest';

export type BenchmarkDatasets = {
  [testName: string]: any;
};

const benchmarkDatasets: BenchmarkDatasets = {
  collisionDetection: {
    Module: collisionDetectionModule,
    testbench: collisionDetectionWasmTest,
    url: './browser_benchmark/collisionDetection.wasm',
    dataSize: 0x4000,
  },
  fibonacci: {
    Module: fibModule,
    testbench: fibWasmTest,
    url: './browser_benchmark/fib.wasm',
    dataSize: 0x28,
  },
  multiplyDouble: {
    Module: multiplyDoubleModule,
    testbench: multiplyDoubleWasmTest,
    url: './browser_benchmark/multiplyDouble.wasm',
    dataSize: 0x10000000,
  },
  multiplyIntVec: {
    Module: multiplyIntVecModule,
    testbench: multiplyIntVecWasmTest,
    url: './browser_benchmark/multiplyIntVec.wasm',
    dataSize: 0x2000000,
  },
  multiplyDoubleVec: {
    Module: multiplyDoubleVecModule,
    testbench: multiplyDoubleVecWasmTest,
    url: './browser_benchmark/multiplyDoubleVec.wasm',
    dataSize: 0x2000000,
  },
  quicksortInt: {
    Module: quicksortIntModule,
    testbench: quicksortIntWasmTest,
    url: './browser_benchmark/quicksortInt.wasm',
    dataSize: 0x200000,
  },
  quicksortDouble: {
    Module: quicksortDoubleModule,
    testbench: quicksortDoubleWasmTest,
    url: './browser_benchmark/quicksortDouble.wasm',
    dataSize: 0x200000,
  },
  sumInt: {
    Module: sumIntModule,
    testbench: sumIntWasmTest,
    url: './browser_benchmark/sumInt.wasm',
    dataSize: 0x8000000,
  },
  sumDouble: {
    Module: sumDoubleModule,
    testbench: sumDoubleWasmTest,
    url: './browser_benchmark/sumDouble.wasm',
    dataSize: 0x4000000,
  },
};

export default benchmarkDatasets;
