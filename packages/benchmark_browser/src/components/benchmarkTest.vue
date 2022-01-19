<template>
  <div style="width: 70%; border: 1px solid; border-radius: 15px">
    <div style="border-bottom: 1px solid">
      <h3>Configure:</h3>
      <p>
        Warm-up run loops:
        <input
          style="width: 50px; text-align: center"
          v-model="wasmTest.warmUpRunLoops"
        />
      </p>
      <p>
        Benchmark run loops:
        <input
          style="width: 50px; text-align: center"
          v-model="wasmTest.benchmarkRunLoops"
        />
      </p>
      <p>
        <button
          :disabled="btnDisabled"
          @click="start()"
          style="font-size: 15px"
        >
          Run Benchmark
        </button>
      </p>
    </div>
    <br />
    <div>
      <h3>Results:</h3>
      <p>
        <span
          >Status : <code>{{ message }}</code></span
        >
      </p>
      <p>
        JavaScript(average [ms]): <span>{{ jsPerformance }}</span>
      </p>
      <p v-for="(wsPerformance, runWasmFuncName) in wsPerformances">
        {{ runWasmFuncName }} WebAssembly(average [ms]):
        <span>{{ wsPerformance }}</span>
      </p>
      <p v-for="(comparison, runWasmFuncName) in comparisons">
        {{ runWasmFuncName }} JavaScript/WebAssembly:
        <span>{{ comparison }}</span>
      </p>
    </div>
  </div>
</template>
<script>
import {
  loadEmccCompiledWasm,
  loadRustCompiledWasm,
} from '../../../benchmark_base/src/loadWasmUtils';

export default {
  name: 'benchmarkTest',
  props: {
    benchmarkDataset: Object,
  },
  data() {
    return {
      message: 'Ready',
      btnDisabled: false,
      jsPerformance: '',
      wsPerformances: { '': '' },
      comparisons: { '': '' },
      benchmarkName: 'JavaScript ',
    };
  },
  async setup(props) {
    const warmUpRunLoops = 1;
    const benchmarkRunLoops = 10;
    const benchmarkDataset = props.benchmarkDataset;

    // init modules
    const { cGlueFunc, cWasmUrl, rustWasmUrl } = benchmarkDataset;
    const modules = {};
    if (!!cGlueFunc && !!cWasmUrl) {
      modules.cModule = await loadEmccCompiledWasm(cWasmUrl, cGlueFunc);
    }
    if (rustWasmUrl.length == 0) {
      modules.rustModule = {}
    }

    if (!!rustWasmUrl) {
      modules.rustModule = await loadRustCompiledWasm(rustWasmUrl);
    }

    // init wasmTest class
    const { testbench, dataSize } = benchmarkDataset;
    const wasmTest = new testbench(
      dataSize,
      warmUpRunLoops,
      benchmarkRunLoops,
      modules,
      props.benchmarkDataset.dom,
      props.benchmarkDataset.jsCanvas,
      props.benchmarkDataset.wsCanvas,
    );
    return { wasmTest };
  },
  methods: {
    start() {
      setTimeout(() => {
        if (!this.wasmTest.checkFunctionality()) {
          this.message = 'Two functions seem not equal';
          this.btnDisabled = false;
          return;
        }

        setTimeout(() => {
          this.jsPerformance = this.wasmTest.runJavaScriptBenchmark();
          setTimeout(() => {
            this.wsPerformances = this.wasmTest.runWasmBenchmark();
            const comparisons = {};
            for (const runWasmFuncName in this.wsPerformances) {
              comparisons[runWasmFuncName] = (
                this.jsPerformance / this.wsPerformances[runWasmFuncName]
              ).toFixed(4);
            }
            this.comparisons = comparisons;
            this.message = 'Done';
          });
          this.message = 'Running WebAssembly';
        });
        this.message = 'Running JavaScript';
      });
      this.message = 'Checking equality';
    },
  },
};
</script>
<style scoped></style>
