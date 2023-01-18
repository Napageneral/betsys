import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@client/views/HomeView.vue";
import PlayerView from "@client/views/PlayerView.vue";
import ApplicationView from "@client/views/PlayerView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/Player/:playerID/",
      name: "playerView",
      component: PlayerView
    }
  ],
});

export default router;
