import wasm from './multiplyDoubleRust.wasm';

/**
 * @param {number} a
 * @param {number} b
 * @param {number} n
 * @returns {number}
 */
export function multiply_double(a, b, n) {
  var ret = wasm.multiply_double(a, b, n);
  return ret;
}
