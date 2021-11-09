// @ts-ignore
import sumIntModule from '~/browser_benchmark/sumInt.js'

const benchmarkDatasets = {
    'sumInt': {
        'Module': sumIntModule,
        'url': '/browser_benchmark/sumInt.wasm',
        'dataSize': 0x8000000
    }
}

export default benchmarkDatasets
