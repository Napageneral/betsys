
<script setup lang="ts">

import {BookAccount} from "@shared/models/BookAccount";
import {ComputedRef, computed} from "vue";
import CreateBookAccountModal from "@client/components/BookAccount/CreateBookAccountModal.vue";

  const props = defineProps<{
    playerID: string,
    getData: () => ComputedRef<BookAccount[] | undefined>
  }>();

  const emit = defineEmits<{
    (e: 'reloadBookAccounts'): void
  }>();

  const columns = [
    { key: 'BookName', sortable: true },
    { key: 'AccountBalance', sortable: true },
    { key: 'Email', sortable: true },
    { key: 'Username', sortable: true },
    { key: 'Password', sortable: true },
    { key: 'MarketLimits', sortable: true }
  ];

  const BookAccountRows = computed(function() {
    console.log("playerID prop", props.playerID)
    return props.getData().value;
  });

  function reloadBookAccounts() {
    emit("reloadBookAccounts");
  }

</script>

<template>
  <div class="aa-flex-row">
    <div/> <!-- align-right fix -->
    Add BookAccount
    <CreateBookAccountModal mode="Create" size="small" class="aa-align-right aa-flex-smallify" :playerid="props.playerID" @reloadConfigs="reloadBookAccounts"/>
  </div>
  <va-data-table
      :items="BookAccountRows"
      :columns="columns"
      :hoverable="true"
      striped
  >
    <template #cell(LocationUri)="{ value }">
      <!-- for s3 files, truncate and allow hover over to see the full text -->
      <va-popover v-if="value != 'hosted'" placement="right" trigger="click" :hover-out-timeout="30" :message="value" :close-on-content-click="false">
        <a :label="value">{{ value.length < 20 ? value : value.substring(0, 20)+"..." }}</a>
      </va-popover>
      <!-- for shorter values, just show them directly -->
      <span v-else>
            {{ value }}
          </span>
    </template>
  </va-data-table>
</template>

<style scoped>
.va-chip {
  margin-right: 5px;
}
.aa-flex-align-center {
  align-items: center;
}
</style>