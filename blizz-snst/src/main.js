import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { VueFire, VueFireAuth } from "vuefire";
import { firebaseApp } from "./firebase/firebase";
import { createBootstrap } from "bootstrap-vue-next";
import { createPinia } from "pinia";

// Add the necessary CSS
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});
app.use(createBootstrap());
app.use(router);

app.mount("#app");
