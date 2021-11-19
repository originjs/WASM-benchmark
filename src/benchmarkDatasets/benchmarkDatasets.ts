// @ts-ignore
import collisionDetectionModule from '~/browser_benchmark/collisionDetection';
import collisionDetectionWasmTest from '@/benchmarkTests/collisionDetectionWasmTest';
// @ts-ignore
import fibModule from '~/browser_benchmark/fib';
import fibWasmTest from '@/benchmarkTests/fibWasmTest';
// @ts-ignore
import imageConvoluteModule from '~/browser_benchmark/imageConvolute';
import imageConvoluteWasmTest from '@/benchmarkTests/imageConvoluteWasmTest';
import imageGrayscaleModule from '~/browser_benchmark/imageGrayscale';
import imageGrayscaleWasmTest from '@/benchmarkTests/imageGrayscaleWasmTest';
// @ts-ignore
import multiplyDoubleModule from '~/browser_benchmark/multiplyDouble';
import multiplyDoubleWasmTest from '@/benchmarkTests/multiplyDoubleWasmTest';
// @ts-ignore
import multiplyIntVecModule from '~/browser_benchmark/multiplyIntVec';
import multiplyIntVecWasmTest from '@/benchmarkTests/multiplyIntVecWasmTest';
// @ts-ignore
import multiplyDoubleVecModule from '~/browser_benchmark/multiplyDoubleVec';
import multiplyDoubleVecWasmTest from '@/benchmarkTests/multiplyDoubleVecWasmTest';
// @ts-ignore
import quicksortIntModule from '~/browser_benchmark/quicksortInt';
import quicksortIntWasmTest from '@/benchmarkTests/quicksortIntWasmTest';
// @ts-ignore
import quicksortDoubleModule from '~/browser_benchmark/quicksortDouble';
import quicksortDoubleWasmTest from '@/benchmarkTests/quicksortDoubleWasmTest';
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
  imageGrayscale: {
    Module: imageGrayscaleModule,
    testbench: imageGrayscaleWasmTest,
    url: '/browser_benchmark/imageGrayscale.wasm',
    image: '/src/assets/image.jpg',
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
  multiplyDoubleVec: {
    Module: multiplyDoubleVecModule,
    testbench: multiplyDoubleVecWasmTest,
    url: '/browser_benchmark/multiplyDoubleVec.wasm',
    dataSize: 0x2000000,
  },
  quicksortInt: {
    Module: quicksortIntModule,
    testbench: quicksortIntWasmTest,
    url: '/browser_benchmark/quicksortInt.wasm',
    dataSize: 0x200000,
  },
  quicksortDouble: {
    Module: quicksortDoubleModule,
    testbench: quicksortDoubleWasmTest,
    url: '/browser_benchmark/quicksortDouble.wasm',
    dataSize: 0x200000,
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
