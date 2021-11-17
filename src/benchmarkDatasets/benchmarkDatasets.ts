// @ts-ignore
import sumIntModule from '~/browser_benchmark/sumInt'
import sumIntWasmTest from '@/benchmarkTests/sumIntWasmTest'

const benchmarkDatasets = {
    'sumInt': {
        'Module': sumIntModule,
        'testbench': sumIntWasmTest,
        'url': '/browser_benchmark/sumInt.wasm',
        'dataSize': 0x8000000
    }
}

export default benchmarkDatasets
