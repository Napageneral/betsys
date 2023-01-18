
<script setup lang="ts">

defineProps({
  routeParams: Object
})


</script>

<template>
  <va-breadcrumbs>
    <va-breadcrumbs-item label="" to="/">
      <va-icon name="home" size="1.2rem"/>
    </va-breadcrumbs-item>
    <va-breadcrumbs-item v-if="routeParams.stackName"
       :label="routeParams.stackName"
    />
    <va-breadcrumbs-item v-if="routeParams.appName"
       :label="routeParams.appName"
       :to="`/stack/${routeParams.stackName}/app/${routeParams.appName}`"
    />
    <va-breadcrumbs-item v-if="routeParams.envName"
       :label="routeParams.envName"
       :to="`/stack/${routeParams.stackName}/app/${routeParams.appName}/environment/${routeParams.envName}`"
    />
    <va-breadcrumbs-item v-if="routeParams.configName"
       :label="routeParams.configName"
       :to="`/stack/${routeParams.stackName}/app/${routeParams.appName}/config/${routeParams.configName}`"
    />
    <va-breadcrumbs-item v-if="routeParams.versionNumber"
       :label="routeParams.versionNumber"
       :to="`/stack/${routeParams.stackName}/app/${routeParams.appName}/config/${routeParams.configName}/version/${routeParams.versionNumber}`"
    />
  </va-breadcrumbs>
</template>

<style>

</style>