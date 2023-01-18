<script setup lang="ts">
import TabManager from "@client/components/TabManager.vue";
import CreatePlayerModal from "@client/components/Player/CreatePlayerModal.vue";
import {listPlayers} from "@client/actions/Player";
import {computed, watch} from "vue";
import PlayerDataTable from "@client/components/Player/PlayerDataTable.vue";


const players = listPlayers().ref;

watch(players, function() {
  console.log("Players", players);
});

function getPlayers() {
  return computed(function() {
    return players.value;
  });
}

function reloadPlayers() {
  const actionData = listPlayers();
  actionData.promise.then(function() {
    players.value = actionData.ref.value;
  });
}

</script>

<template>
  <main>
    <TabManager :tabs="['Players']" class="padded-holder">
      <template #Players>
        <PlayerDataTable :getData="getPlayers" @reloadConfigs="reloadPlayers"/>
      </template>
    </TabManager>
  </main>
</template>

<style>
</style>