import "@/assets/index.css";
import App from "./main.vue";
import { createApp } from "vue";
import router from "@/main/router";

createApp(App).use(router).mount("#app");
