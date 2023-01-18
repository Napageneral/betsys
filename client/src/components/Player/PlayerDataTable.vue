
<script setup lang="ts">

import {Player} from "@shared/models/Player";
  import {ComputedRef, computed} from "vue";
  import {useRouter} from "vue-router";
  import CreatePlayerModal from "@client/components/Player/CreatePlayerModal.vue";

  const router = useRouter();

  const props = defineProps<{
    getData: () => ComputedRef<Player[] | undefined>
  }>();

  const emit = defineEmits<{
    (e: 'reloadPlayers'): void
  }>();

  const columns = [
    { key: 'PlayerID', sortable: true },
    { key: 'FirstName', sortable: true },
    { key: 'LastName', sortable: true },
    { key: 'HomeAddress', sortable: true },
    { key: 'SSN' }
  ];

  const playerRows = computed(function() {
    return props.getData().value;
  });

  function reloadPlayers() {
    emit("reloadPlayers");
  }

function navigateToPlayer(rowClickEmit: any) {
  router.push(`/player/${rowClickEmit.item.PlayerID}`);
}

</script>

<template>
  <div class="aa-flex-row">
    <div/> <!-- align-right fix -->
    Add Player
    <CreatePlayerModal mode="Create" size="small" class="aa-align-right aa-flex-smallify" @reloadConfigs="reloadPlayers"/>
  </div>
  <va-data-table
      :items="playerRows"
      :columns="columns"
      :hoverable="true"
      :clickable="true"
      @row:click="navigateToPlayer"
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