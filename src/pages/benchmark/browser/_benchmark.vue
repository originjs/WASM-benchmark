<template>
  <div style="width: 100%;">
    <h1 style="margin-top: 3rem;">Benchmark : {{ $route.params.benchmark }}</h1>
    <div style="width: 100%; display: flex; justify-content: center; height: 40rem;">
      <ul style="margin-left: 5rem; display: flex; flex-direction: column; justify-content: center;">
        <li><router-link class="text-router-link" to="/benchmark/browser/sumInt">sumInt</router-link></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
      </ul>
      <div style="width: 100%; margin-left: 0; display: flex; flex-direction: column; justify-content: center;">
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
