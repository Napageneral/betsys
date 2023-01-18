
<script setup lang="ts">
import {computed, reactive, ref, Ref } from "vue";
import {getSearchParam, setSearchParam } from "@client/utilities/utilities";
import { useRoute } from "vue-router";

const props = defineProps<{
  name?: string,
  tabs: string[],
  initialTab: string,
  tabPrefix: string,
  showTitles?: boolean
}>();

// console.log("initialTab is \"", props.initialTab, "\"");
// console.log("tabs \"", props.tabs, "\"");

// handle the case where the initialTab is not a valid tab
let validInitialTab = props.tabs[0];
if(props.tabs.includes(props.initialTab)) {
  // console.log("initial tab was in tabs");
  validInitialTab = props.initialTab;
}
if(props.name !== undefined) {
  const urlTab = getSearchParam(props.name);
  if(urlTab !== undefined) {
    if (props.tabs.includes(urlTab)) {
      // console.log("url tab was in tabs");
      validInitialTab = urlTab;
    } else {
      console.log("%c url tab value is invalid", "color: yellow", urlTab);
    }
  } else {
    console.log("%c url doesn't contain a tab value", "color: yellow", urlTab);
  }
} else {
  console.log("%c no url tab name defined", "color: yellow");
}

// console.log("validInitialTab is \"", validInitialTab, "\"");

let tabManager = ref(validInitialTab);

function changeTabInUrl(tab: string) {
  console.log("%cCurrent tab", "color: yellow", tab);
  if(props.name !== undefined) {
    setSearchParam(props.name, tab);
  }
}

function getCurrentTab(): Ref<string> {
  return tabManager;
}

defineExpose({
  getCurrentTab
});

</script>

<template>
  <div class="holder">
    <va-tabs v-model="tabManager" stateful @click="changeTabInUrl(tabManager)">
      <template #tabs>
        <va-tab v-for="tabName of tabs" :name="tabName" :key="tabName">{{ tabName }}</va-tab>
      </template>
    </va-tabs>
    <template v-for="tab in tabs">
      <div v-if="tabManager === tab">
        <div class="spacer"></div>
        <div class="tab-body-title" v-if="showTitles ?? true">{{ tabPrefix }} {{ tab }}</div>
        <slot :name="tab.replaceAll(' ','_')"></slot>
      </div>
    </template>
  </div>
</template>

<style>
.spacer {
  height: 1rem;
}
</style>