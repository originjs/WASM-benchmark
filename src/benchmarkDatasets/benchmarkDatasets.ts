// @ts-ignore
import collisionDetectionModule from '~/browser_benchmark/collisionDetection';
import collisionDetectionWasmTest from '@/benchmarkTests/collisionDetectionWasmTest';
// @ts-ignore
import fibModule from '~/browser_benchmark/fib';
import fibWasmTest from '@/benchmarkTests/fibWasmTest';
// @ts-ignore
import imageConvoluteModule from '~/browser_benchmark/imageConvolute'
import imageConvoluteWasmTest from '@/benchmarkTests/imageConvoluteWasmTest';
// @ts-ignore
import sumIntModule from '~/browser_benchmark/sumInt';
import sumIntWasmTest from '@/benchmarkTests/sumIntWasmTest';
// @ts-ignore
import sumDoubleModule from '~/browser_benchmark/sumDouble';
import sumDoubleWasmTest from '@/benchmarkTests/sumDoubleWasmTest';
// @ts-ignore
import multiplyDoubleModule from '~/browser_benchmark/multiplyDouble';
import multiplyDoubleWasmTest from '@/benchmarkTests/multiplyDoubleWasmTest';
// @ts-ignore
import multiplyIntVecModule from '~/browser_benchmark/multiplyIntVec';
import multiplyIntVecWasmTest from '@/benchmarkTests/multiplyIntVecWasmTest';

const benchmarkDatasets = {
  collisionDetection: {
    Module: collisionDetectionModule,
    testbench: collisionDetectionWasmTest,
    url: '/browser_benchmark/collisionDetection.wasm',
    dataSize: 0x4000,
  },
  fibonacci: {
    Module: fibModule,
    testbench: fibWasmTest,
    url: '/browser_benchmark/fib.wasm',
    dataSize: 0x28,
  },
  imageConvolute: {
    Module: imageConvoluteModule,
    testbench: imageConvoluteWasmTest,
    url: '/browser_benchmark/imageConvolute.wasm',
    image: '/src/assets/image.jpg',
  },
  sumInt: {
    Module: sumIntModule,
    testbench: sumIntWasmTest,
    url: '/browser_benchmark/sumInt.wasm',
    dataSize: 0x8000000,
  },
  sumDouble: {
    Module: sumDoubleModule,
    testbench: sumDoubleWasmTest,
    url: '/browser_benchmark/sumDouble.wasm',
    dataSize: 0x4000000,
  },
  multiplyDouble: {
    Module: multiplyDoubleModule,
    testbench: multiplyDoubleWasmTest,
    url: '/browser_benchmark/multiplyDouble.wasm',
    dataSize: 0x10000000,
  },
  multiplyIntVec: {
    Module: multiplyIntVecModule,
    testbench: multiplyIntVecWasmTest,
    url: '/browser_benchmark/multiplyIntVec.wasm',
    dataSize: 0x2000000,
  },
};

export default benchmarkDatasets;
