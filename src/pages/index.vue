<template>
  <router-view />
  <div class="router-link">
    <div><router-link class="text-router-link" to="/benchmark/browser/benchmark">WASM in Browser Benchmark</router-link></div>
  </div>
</template>

<script>
export default {
  name: 'Index'
}
</script>
