<template>
  <div style="width: 100%;">
    <h1 style="margin-top: 3rem;">Benchmark : {{ $route.params.benchmark }}</h1>
    <div style="width: 100%; display: flex; justify-content: center; height: 40rem;">
      <ul style="margin-left: 5rem; display: flex; flex-direction: column; justify-content: center;">
        <li><router-link class="text-router-link" to="/benchmark/browser/sumInt">sumInt</router-link></li>
        <li><router-link class="text-router-link" to="/benchmark/browser/collisionDetection">collisionDetection</router-link></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
        <li><a>test</a></li>
      </ul>
      <div style="width: 100%; margin-left: 0; display: flex; flex-direction: column; justify-content: center;">
        <div style="display: flex; justify-content: center;">
          <suspense :timeout="0">
            <template #default>
              <BenchmarkTest :key="$route.params.benchmark" :benchmarkDataset="getBenchmarkDataset()"/>
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
import { Suspense } from 'vue'
import benchmarkDatasets from '@/benchmarkDatasets/benchmarkDatasets'
export default {
  name: "benchmark",
  setup() {
    return { benchmarkDatasets }
  },
  components: {
    Suspense
  },
  methods: {
    getBenchmarkDataset() {
      const benchmarkName = this.$route.params.benchmark
      if (benchmarkDatasets[benchmarkName]) {
        return benchmarkDatasets[benchmarkName]
      }

      // default benchmark
      return benchmarkDatasets.sumInt
    }
  }
}
</script>
<layout>
layout: profile
</layout>
