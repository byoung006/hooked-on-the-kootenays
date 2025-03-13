<template>
  <header>
    <NavBar />
  </header>
  <RouterView />
</template>

<script lang="ts">
import NavBar from './components/NavBar.vue';
export default {
  components: {
    NavBar
  },
};
</script>
<style scoped>
/* esri styles */
@import url('https://js.arcgis.com/4.4/esri/themes/light/main.css');

header {
  line-height: 1.5;
  max-height: 100vh;
  background-color: #333;
  color: white;
  padding: 1rem 0;
  z-index: 100 !important;
  min-width: 100vw;
}


#app {
  height: 100vh;
  width: 100vw;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
}

#map-container {
  flex-grow: 1;
  /* Allow map container to take up remaining space */
  position: relative;
  /* Needed for absolute positioning of viewDiv within */
}
</style>
