import wasm from './imageConvoluteRust_bg.wasm';

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

let WASM_VECTOR_LEN = 0;

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

function passArrayF64ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 8);
    getFloat64Memory0().set(arg, ptr / 8);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}
/**
* @param {Uint8Array} data
* @param {Uint8Array} data2
* @param {number} width
* @param {number} height
* @param {Float64Array} weights
* @param {number} wwidth
* @param {number} wheight
*/
export function imageConvolute(data, data2, width, height, weights, wwidth, wheight) {
    try {
        var ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passArray8ToWasm0(data2, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = passArrayF64ToWasm0(weights, wasm.__wbindgen_malloc);
        var len2 = WASM_VECTOR_LEN;
        wasm.imageConvolute(ptr0, len0, ptr1, len1, width, height, ptr2, len2, wwidth, wheight);
    } finally {
        data2.set(getUint8Memory0().subarray(ptr1 / 1, ptr1 / 1 + len1));
        wasm.__wbindgen_free(ptr1, len1 * 1);
    }
}

