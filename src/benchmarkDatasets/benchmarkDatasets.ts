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
};

export default benchmarkDatasets;
