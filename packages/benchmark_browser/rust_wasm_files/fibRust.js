import wasm from './fibRust.wasm';

/**
 * @param {number} n
 * @returns {number}
 */
export function fib(n) {
  var ret = wasm.fib(n);
  return ret >>> 0;
}
