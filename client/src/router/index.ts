import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@client/views/HomeView.vue";
import ApplicationView from "@client/views/ApplicationView.vue";
import ConfigView from "@client/views/ConfigView.vue";
import DeploymentHistoryView from "@client/views/DeploymentHistoryView.vue";
import ConfigurationBundleView2 from "@client/views/ConfigurationBundleView2.vue";
import EnvironmentView from "@client/views/EnvironmentView.vue";
import CreateDeploymentRequestView from "@client/views/CreateDeploymentRequestView.vue";
import DeploymentRequestView from "@client/views/DeploymentRequestView.vue";
import ApiView from "@client/views/ApiView.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/testapi",
      name: "testapi",
      component: ApiView
    },
    {
      path: "/app/:appName/",
      name: "applicationView",
      component: ApplicationView
    },
    {
      path: "/app/:appName/config/:configName",
      name: "ConfigurationBundleView",
      component: ConfigurationBundleView2
    },
    {
      path: "/app/:appName/env/:envName",
      name: "environmentView",
      component: EnvironmentView
    },
    {
      path: "/app/:appName/config/:configName/bundle/:bundleId/version/:versionNumber/createDeploymentRequest",
      name: "createDeploymentRequestView",
      component: CreateDeploymentRequestView
    },
    {
      path: "/deploymentRequest/:deploymentId",
      name: "deploymentRequestView",
      component: DeploymentRequestView
    }
  ],
});

export default router;
