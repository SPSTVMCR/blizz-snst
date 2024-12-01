<template>
  <div class="login">
    <h1>Login</h1>

    <BForm @submit.prevent="login">
      <BInput type="email" v-model="email" placeholder="Email" required />
      <BInput
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <BButton type="submit" variant="primary">Sign In</BButton>
      <!--Sign in with Google-->
    </BForm>
    <BButton class="my-2" variant="outline-dark" @click="loginGoogle"
      >Sign in with Google</BButton
    >
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <p>
      Don't have an account?
      <router-link to="/register">Register here</router-link>.
    </p>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import router from "@/router";
import { useUserStore } from "@/stores/user";

export default {
  /**
   * Setup function for the Login component.
   * Handles user login via email/password or Google authentication.
   */
  setup() {
    const email = ref(""); // User's email input
    const password = ref(""); // User's password input
    const errorMessage = ref(""); // Error message to be displayed
    const userStore = useUserStore(); // User store for managing user data

    /**
     * Login with Google account using Firebase Authentication.
     */
    const loginGoogle = () => {
      try {
        const provider = new GoogleAuthProvider();
        signInWithPopup(getAuth(), provider).then((result) => {
          console.log(result);
          userStore.fetchUser(); // Fetch user data after successful login
          localStorage.setItem("user", JSON.stringify(userStore.user)); // Store user data in localStorage
          router.push("/"); // Redirect to home page
        });
      } catch (error) {
        console.error("Google login error:", error);
      }
    };

    /**
     * Login with email and password using Firebase Authentication.
     */
    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        errorMessage.value = ""; // Clear any previous error messages
        await userStore.fetchUser(); // Fetch user data after successful login
        console.log(userStore.user);
        router.push("/"); // Redirect to home page
      } catch (error) {
        handleLoginError(error.code); // Handle login errors
        console.error("Login error:", error);
      }
    };

    /**
     * Handles login errors by setting appropriate error messages.
     * @param {string} errorCode - The error code from Firebase authentication.
     */
    function handleLoginError(errorCode) {
      switch (errorCode) {
        case "auth/wrong-password":
        case "auth/user-not-found":
          errorMessage.value = "Invalid email or password.";
          break;
        case "auth/too-many-requests":
          errorMessage.value =
            "Too many login attempts. Please try again later.";
          break;
        case "auth/invalid-email":
          errorMessage.value = "Invalid email format.";
          break;
        default:
          errorMessage.value = "An error occurred. Please try again.";
          break;
      }
    }

    return {
      email,
      password,
      errorMessage,
      login,
      loginGoogle,
    };
  },
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 1rem;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
