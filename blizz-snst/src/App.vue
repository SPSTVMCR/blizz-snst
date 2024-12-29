<template>
  <div id="app">
    <Header class="sticky-top"/>
    <RouterView v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component"/>
      </transition>
    </RouterView>
    <!--    <Footer/> Footer component is supposed to be after the RouterView, only visible when scrolled down to the bottom-->

  </div>
  <Footer v-if="route.name !== 'Chat'"/>
</template>

<script>
import {onMounted, ref} from "vue";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth} from "./firebase/firebase";
import Footer from "@/components/Footer.vue";
import {useRoute} from "vue-router";

export default {
  components: {Footer},
  setup() {
    const user = ref(null);
    const route = useRoute();
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
      route,
    };
  },
};
</script>

<style>

body {
  background-size: auto;

  background-position: center;
  background-image: url("../../blizz-snst/src/assets/vivid-blurred-colorful-wallpaper-background.jpg");
}

#app {
  text-align: center;

}

footer {
  position: relative;
  bottom: 0;
  width: 100%;
  margin-top: 2rem;
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

</style>

