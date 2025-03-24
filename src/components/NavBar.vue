<template>
  <nav class="navbar">
    <ul class="nav-list">
      <li class="nav-item">
        <a href="/" class="nav-link">Home</a>

      </li>
      <li class="nav-item">
        <RouterLink to="/about" class="nav-link">About</RouterLink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { RouterLink, RouterView } from 'vue-router';
export default {
  name: 'NavBar',
};
</script>

<style scoped>
.navbar {
  background-color: #333;
  color: white;
  padding: 1rem 0;
}

.nav-list {
  list-style: none;
  display: flex;
  justify-content: center;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin: 0 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #bbb;
}
</style>
