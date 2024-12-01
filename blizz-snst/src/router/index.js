// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Profile from "../views/Profile.vue";
import Lobby from "../views/Lobby.vue";
import PostDetailed from "@/views/PostDetailed.vue";
import { auth } from "../firebase/firebase"; // Make sure this points to your Firebase config

const routes = [
  { path: "/", name: "Home", component: Home, meta: { requiresAuth: true } },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { requiresAuth: true },
  },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/lobby", name: "Lobby", component: Lobby },
  { path:"/post/:id", name: "Post", component: PostDetailed },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Route guard to protect routes that require authentication
router.beforeEach((to, from, next) => {
  let requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  let isAuthenticated = auth.currentUser;
  if (JSON.parse(localStorage.getItem("user"))) {
    isAuthenticated = true;
    requiresAuth = false;
  }
  if (requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
