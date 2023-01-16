import { createApp } from "vue";
import { createVuestic } from "vuestic-ui";
import { createPinia } from "pinia";

import App from "./App.vue";
import Vue from "vue";
import router from "@client/router/index";

import "vuestic-ui/css";
import "@client/assets/main.css";
import 'material-design-icons-iconfont/dist/material-design-icons.css'

const app = createApp(App);

app.use(createVuestic({
    config: {
        colors: {
            variables: {
                primary: "#2C82E0",
                softDark: "#222222"
            }
        }
    }
}));
app.use(createPinia());
app.use(router);

app.mount("#app");
