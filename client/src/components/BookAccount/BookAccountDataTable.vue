
<script setup lang="ts">

import {BookAccount} from "@shared/models/BookAccount";
  import {ComputedRef, computed} from "vue";
import {useRoute, useRouter} from "vue-router";
  import CreateBookAccountModal from "@client/components/BookAccount/CreateBookAccountModal.vue";

  const router = useRouter();

  const route = useRoute();
  const playerID = route.params.playerID as string;

  const props = defineProps<{
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
    return props.getData().value;
  });

  function reloadBookAccounts() {
    emit("reloadBookAccounts");
  }

function navigateToBookAccount(rowClickEmit: any) {
  router.push(`Player/${playerID}/BookAccount/${rowClickEmit.item.BookAccountID}`);
}

</script>

<template>
  <div class="aa-flex-row">
    <div/> <!-- align-right fix -->
    Add BookAccount
    <CreateBookAccountModal mode="Create" size="small" class="aa-align-right aa-flex-smallify" @reloadConfigs="reloadBookAccounts"/>
  </div>
  <va-data-table
      :items="BookAccountRows"
      :columns="columns"
      :hoverable="true"
      :clickable="true"
      @row:click="navigateToBookAccount"
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