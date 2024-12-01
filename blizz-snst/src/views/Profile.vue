<template>
  <h1>Profile</h1>
  <BCard
    class="mb-2 d-flex flex-row align-items-start w-100"
    v-if="user"
    no-body
  >
    <div
      class="d-flex flex-column align-items-center w-50 border-right border-1"
    >
      <h3>{{ user.displayName || user.email }}</h3>
      <p v-if="user.displayName != null">Email: {{ user.email }}</p>
      <p>Account Type: {{ accountType }}</p>
    </div>
    <div class="d-flex flex-column align-items-center w-50">
      <button class="btn btn-primary" @click="userStore.logout">Logout</button>
      <button class="btn btn-primary">Change Password</button>
      <button class="btn btn-primary">Change Username</button>
      <button class="btn btn-primary">Delete Account</button>
    </div>
  </BCard>
  <p v-else>You are not logged in. How can you even see this?</p>
</template>

<script>
import { ref } from "vue";
import { getAuth } from "firebase/auth";
import { useUserStore } from "@/stores/user";
import { Timestamp } from "firebase/firestore";
import router from "@/router";

export default {
  setup() {
    const userStore = useUserStore();
    const auth = getAuth();
    const user = ref(null);
    const accountType = ref(null);
    if (localStorage.getItem("user")) {
      user.value = JSON.parse(localStorage.getItem("user"));
      if (user.value.emailVerified) {
        if (user.value.providerData[0].providerId === "password") {
          accountType.value = "Email Account";
        } else if (user.value.providerData[0].providerId === "google.com") {
          accountType.value = "Google Account";
        } else {
          accountType.value = "uncertified dummy account";
        }
      }
    }

    return { user, userStore, auth, accountType };
  },
};
</script>
