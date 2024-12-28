<template>
  <footer class="py-3 ">
    <ul class="nav justify-content-center border-bottom pb-3 mb-3">
      <li class="nav-item"><a to="/" class="nav-link px-2 text-muted">Home</a></li>
      <li class="nav-item"><a to="/profile" class="nav-link px-2 text-muted">Profile</a></li>
      <li class="nav-item"><a to="/lobby" class="nav-link px-2 text-muted">Chatrooms</a></li>
    </ul>
    <p class="text-center text-muted">&copy; 2024 SPSTVMCR</p>
  </footer>
</template>

<style scoped>
footer {
  width: 100%;

}

</style>

<script setup>
import {useUserStore} from "@/stores/user";
import {useRoute} from "vue-router";


const route = useRoute();
const userStore = useUserStore();
console.log(userStore.user);
</script>