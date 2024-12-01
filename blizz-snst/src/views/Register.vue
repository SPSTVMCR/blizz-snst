<template>
  <div class="register">
    <h1>Register</h1>

    <BForm @submit.prevent="register">
      <!--Photo upload to imgbb -->
      <BFormInput type="email" v-model="email" placeholder="Email" required />
      <BFormInput
        type="password"
        v-model="password"
        placeholder="Password"
        required
      />
      <BFormInput
        type="password"
        v-model="confirmPassword"
        placeholder="Confirm Password"
        required
      />

      <button type="submit">Register</button>
    </BForm>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <p>
      Already have an account?
      <router-link to="/login">Log in here</router-link>.
    </p>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  getAuth,
} from "firebase/auth";
import { auth } from "../firebase/firebase"; // Ensure this points to your Firebase config
export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const confirmPassword = ref("");
    const errorMessage = ref("");
    const register = async () => {
      if (password.value !== confirmPassword.value) {
        errorMessage.value = "Passwords do not match.";
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        errorMessage.value = "";
        //Update user profile with name
        await updateProfile(auth.currentUser, {
          photoURL: await uploadImage(),
        });
        // Redirect to login page
        this.$router.push("/login");
      } catch (error) {
        errorMessage.value = "Failed to register. Please try again.";
        console.error("Registration error:", error);
      }
    };

    return {
      email,
      password,
      confirmPassword,
      errorMessage,
      register,
    };
  },
};
</script>

<style scoped>
.register {
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

#photo {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px !important;
  border-radius: 5px;
  border: 1px solid #ccc;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
