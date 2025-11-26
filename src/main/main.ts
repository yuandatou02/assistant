import "./style.css";
import App from "./main.vue";
import { createApp } from "vue";
import router from "./router";
import { createPinia } from "pinia";

createApp(App).use(createPinia()).use(router).mount("#app");
