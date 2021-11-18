// @ts-ignore
import sumIntModule from '~/browser_benchmark/sumInt';
import sumIntWasmTest from '@/benchmarkTests/sumIntWasmTest';
// @ts-ignore
import fibModule from '~/browser_benchmark/fib';
import fibWasmTest from '@/benchmarkTests/fibWasmTest';
// @ts-ignore
import collisionDetectionModule from '~/browser_benchmark/collisionDetection';
import collisionDetectionWasmTest from '@/benchmarkTests/collisionDetectionWasmTest';

const benchmarkDatasets = {
  sumInt: {
    Module: sumIntModule,
    testbench: sumIntWasmTest,
    url: '/browser_benchmark/sumInt.wasm',
    dataSize: 0x8000000,
  },
  fib: {
    Module: fibModule,
    testbench: fibWasmTest,
    url: '/browser_benchmark/fib.wasm',
    dataSize: 0x28,
  },
  collisionDetection: {
    Module: collisionDetectionModule,
    testbench: collisionDetectionWasmTest,
    url: '/browser_benchmark/collisionDetection.wasm',
    dataSize: 0x4000,
  },
};

export default benchmarkDatasets;
