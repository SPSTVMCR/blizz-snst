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
      <button class="btn btn-primary" @click="logout">Logout</button>
      <button class="btn btn-primary" @click="changePassword">Change Password</button>
      <button class="btn btn-primary" @click="deleteAccount">Delete Account</button>
    </div>
  </BCard>
  <p v-else>You are not logged in. How can you even see this?</p>
</template>

<script>
import {ref} from "vue";
import {useUserStore} from "@/stores/user";
import {deleteUser, getAuth, sendPasswordResetEmail} from "firebase/auth";
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
        }
      } else {
        accountType.value = "uncertified dummy account";
      }
    }

    const logout = () => {
      userStore.logout();

    };

    const changePassword = () => {
      sendPasswordResetEmail(auth, user.value.email);
      alert("Password reset email sent. Please check your inbox.");
    };

    const deleteAccount = () => {
      deleteUser(auth.currentUser).then(() => {
        alert("Account deleted successfully.");

        localStorage.removeItem("user");
        router.push("/login");
      });
    };

    return {user, userStore, auth, accountType, logout, changePassword, deleteAccount};
  },
};
</script>
