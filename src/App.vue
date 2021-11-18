<template>
  <main class="light">
    <router-view />
  </main>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style src="./assets/global-theme.css"></style>
<style scoped>
#app main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: calc(100vh - 3.2rem);
  min-height: 568px;
  padding: 1rem;
}
</style>
