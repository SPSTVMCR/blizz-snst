<template>
  <div id="app">
    <Header class="sticky-top" />
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { RouterLink, RouterView } from "vue-router";

export default {
  setup() {
    const user = ref(null);

    // Watch authentication state
    onMounted(() => {
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
      });
    });

    // Logout function
    const logout = async () => {
      try {
        await signOut(auth);
        user.value = null;
      } catch (error) {
        console.error("Logout error:", error);
      }
    };

    return {
      user,
      logout,
    };
  },
};
</script>

<style scoped>
#app {
  text-align: center;
}
header {
  padding: 10px;
  background-color: #333;
  color: white;
}
nav {
  display: flex;
  gap: 15px;
  justify-content: center;
}
button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 5px;
}
button:hover {
  background: #0056b3;
}
.fade-in {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.fade-in.show {
  opacity: 1;
}
</style>

