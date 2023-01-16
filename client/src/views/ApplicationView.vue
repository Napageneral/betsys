<script setup lang="ts">
import { useRoute } from 'vue-router';
import BreadcrumbNavigator from "@client/components/BreadcrumbNavigator.vue";
import ConfigDataTable from "@client/components/ConfigurationBundleDataTable.vue";
import EnvironmentDataTable from "@client/components/EnvironmentDataTable.vue";
import DeploymentDataTable from "@client/components/DeploymentDataTable.vue";
import TabManager from "@client/components/TabManager.vue";

import { useStore } from "@client/stores/api/config/ConfigStore";
import {getSearchParam} from "@client/utilities/utilities";
import {computed, ref, watch} from "vue";
import {useToast} from "vuestic-ui";

import {listConfigurationBundles} from "@client/actions/ConfigurationBundle";
import {listEnvironmentBundles} from "@client/actions/EnvironmentBundle";
import {listDeploymentRequests} from "@client/actions/DeploymentRequest";

const route = useRoute();

const appName = route.params.appName as string;

const tab: string | undefined = getSearchParam("tab");

const store = useStore();
const { init } = useToast();

// Set the component up to reload the right data when it needs it
// loadDataOnUpdate(store, init, async function(): Promise<void> {
//   await Promise.all([
//     store.listConfigurationProfilesAction(appName),
//     store.listEnvironmentsAction(appName)
//   ]);
// });

const configBundles = listConfigurationBundles(appName).ref;
const environments = listEnvironmentBundles(appName); // TODO make these ActionData too
const deployments = listDeploymentRequests(appName);

watch(configBundles, function() {
  console.log("Bundles", configBundles);
});

watch(environments, function() {
  console.log("Environments", environments);
});

watch(deployments, function() {
  console.log("Deployments", deployments);
});

function getConfigBundles() {
  return computed(function() {
    return configBundles.value;
  });
}

function getDeployments() {
  return computed(function() {
    return deployments.value;
  });
}

function getEnvironments() {
  return computed(function() {
    return environments.value;
  });
}

function reloadConfigs() {
  const actionData = listConfigurationBundles(appName);
  actionData.promise.then(function() {
    configBundles.value = actionData.ref.value;
  });
}

</script>

<template>
  <BreadcrumbNavigator :routeParams="route.params"/>
  <TabManager :tabs="['Configs', 'Deployments', 'Environments']" :initialTab="tab" :tabPrefix="appName" class="padded-holder">
    <template #Configs>
      <ConfigDataTable :appName="appName" :getData="getConfigBundles" @reloadConfigs="reloadConfigs"/>
    </template>
    <template #Deployments>
      <DeploymentDataTable :appName="appName" :getData="getDeployments"/>
    </template>
    <template #Environments>
      <EnvironmentDataTable :appName="appName" :getData="getEnvironments"/>
    </template>
  </TabManager>
</template>

<style scoped>
  .va-popover__body {
    font-size: 10pt;
  }
</style>