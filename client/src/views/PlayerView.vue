<script setup lang="ts">
import { useRoute } from 'vue-router';
import BreadcrumbNavigator from "@client/components/BreadcrumbNavigator.vue";
import TabManager from "@client/components/TabManager.vue";

import {getSearchParam} from "@client/utilities/utilities";
import {computed, watch} from "vue";

import {listBookAccounts} from "@client/actions/BookAccount";
import BookAccountDataTable from "@client/components/BookAccount/BookAccountDataTable.vue";

const route = useRoute();

const playerID = route.params.playerID as string;

const tab: string | undefined = getSearchParam("tab");

const BookAccounts = listBookAccounts(Number(playerID)).ref;

watch(BookAccounts, function() {
  console.log("BookAccounts", BookAccounts);
});

function getBookAccounts() {
  return computed(function() {
    return BookAccounts.value;
  });
}

function reloadBookAccounts() {
  const actionData = listBookAccounts(Number(playerID));
  actionData.promise.then(function() {
    BookAccounts.value = actionData.ref.value;
  });
}

</script>

<template>
  <BreadcrumbNavigator :routeParams="route.params"/>
  <TabManager :tabs="['BookAccounts']" class="padded-holder">
    <template #BookAccounts>
      <BookAccountDataTable :getData="getBookAccounts" @reloadConfigs="reloadBookAccounts"/>
    </template>
  </TabManager>
</template>

<style scoped>
  .va-popover__body {
    font-size: 10pt;
  }
</style>