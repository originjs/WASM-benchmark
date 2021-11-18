// @ts-ignore
import sumIntModule from '~/browser_benchmark/sumInt'
import sumIntWasmTest from '@/benchmarkTests/sumIntWasmTest'
// @ts-ignore
import collisionDetectionModule from '~/browser_benchmark/collisionDetection'
import collisionDetectionWasmTest from '@/benchmarkTests/collisionDetectionWasmTest'

const benchmarkDatasets = {
    sumInt: {
        Module: sumIntModule,
        testbench: sumIntWasmTest,
        url: '/browser_benchmark/sumInt.wasm',
        dataSize: 0x8000000
    },
    collisionDetection: {
        Module: collisionDetectionModule,
        testbench: collisionDetectionWasmTest,
        url: '/browser_benchmark/collisionDetection.wasm',
        dataSize: 0x4000
    }
}

export default benchmarkDatasets
