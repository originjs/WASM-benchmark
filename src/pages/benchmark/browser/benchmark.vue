<template>
  <div style="width: 100%; vertical-align: top;">
    <h2>This is a JavaScript vs WebAssembly(WASM) benchmark.</h2>
    <h3>The WASM files are written in C/C++ and compiled by emscripten.</h3>
    <div style="width: 100%; display: flex; justify-content: center; height: 40rem;">
      <ul style="margin-left: 150px; display: flex; flex-direction: column; justify-content: center;">
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
      </ul>
      <div style="width: 100%; margin-left: -5rem; display: flex; flex-direction: column; justify-content: center;">
        <div style="display: flex; justify-content: center;">
          <suspense>
            <template #default>
              <BenchmarkTest :benchmarkDataset="benchmarkDatasets.sumInt"/>
            </template>
            <template #fallback>
              <h2>Loading WASM</h2>
            </template>
          </suspense>
        </div>
      </div>
    </div>
  </div>
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
