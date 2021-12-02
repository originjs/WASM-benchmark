const wasm = require('./multiplyDouble.wasm');

/**
* @param {number} a
* @param {number} b
* @param {number} n
* @returns {number}
*/
function multiply_double(a, b, n) {
    var ret = wasm.multiply_double(a, b, n);
    return ret;
}

module.exports = multiply_double

