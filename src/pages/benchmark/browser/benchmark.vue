<template>
  <div>
    <h2>This is a JavaScript vs WebAssembly(WASM) benchmark.</h2>
    <h3>The WASM files are written in C/C++ and compiled by emscripten.</h3>
  </div>
  <suspense>
    <template #default>
      <BenchmarkTest :benchmarkDataset="benchmarkDatasets.sumInt"/>
    </template>
    <template #fallback>
      <h2>Loading WASM</h2>
    </template>
  </suspense>
</template>
<script>
import BenchmarkTest from './benchmarkTest.vue'
import { Suspense } from 'vue'
import benchmarkDatasets from '@/benchmarkDatasets/benchmarkDatasets'
export default {
  name: "benchmark",
  setup() {
    return { benchmarkDatasets }
  },
  components: {
    BenchmarkTest,
    Suspense
  }
}
</script>
<layout>
layout: profile
</layout>
