import { defineStore } from "pinia";
import { ref } from "vue";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import router from "../router";

/**
 * User store for managing user authentication state.
 */
export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const currentPost = ref(null);

  // Initialize user from local storage if available
  if (localStorage.getItem("user")) {
    user.value = JSON.parse(localStorage.getItem("user"));
  }

  /**
   * Logs out the current user and redirects to the login page.
   */
  const logout = async () => {
    try {
      await signOut(auth);
      user.value = null;
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /**
   * Fetches the current authenticated user and updates the store.
   */
  const fetchUser = async () => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
      localStorage.setItem("user", JSON.stringify(user.value));
    });
  };

  return { user, logout, fetchUser };
});
