<script setup lang="ts">

import {computed, ref, watch} from "vue";
  import axios from "axios";
  import {getSearchParam, setSearchParam} from "@client/utilities/utilities";
  import {SERVER_PORT} from "../../../../shared/constants";
  import JsonEditor2 from "@client/components/JsonEditor2.vue";

  const verb = ref(getSearchParam("verb") ?? "POST");
  const path = ref(getSearchParam("path") ?? "/api/config/Application/List");
  const body = ref(getSearchParam("body") ?? "{}");
  const result = ref("blah");

  async function sendRequest() {

    setSearchParam("verb", verb.value);
    setSearchParam("path", path.value);
    setSearchParam("body", body.value);

    try {
      const response = await axios({
        method: verb.value.toLowerCase(),
        url: `${location.origin}${path.value}`,
        data: JSON.parse(body.value)
      });
      result.value = JSON.stringify(response, null, '\t');
      console.log(response);
    } catch(err: any) {
      result.value = err.valueOf() ?? err.toString() ?? err;
      console.log(err);
    }
  }

  function getContent() {
    return computed(() => result.value);
  }

  function getBody() {
    return computed(() => body.value);
  }

  function updateBody(val: string) {
    body.value = val;
  }

</script>

<template>
  <va-card class="aa-pad" style="display: flex; flex-direction: column;">
    <div class="page-body-title aa-pad">Api Test</div>
    <div style="display: flex; flex-direction: row;">
      <va-select class="aa-gap aa-mono" style="width: 120px;" v-model="verb" :options="['GET', 'POST']"/>
      <va-input class="aa-gap" v-model="path"/>
    </div>
    <JsonEditor2 class="aa-gap" :content="getBody" type="full" @contentUpdate="updateBody" :minLines="1"/>
    <div style="display: flex; flex-direction: row;">
      <va-button class="aa-gap" @click="sendRequest">Send</va-button>
    </div>
    <JsonEditor2 class="aa-gap" :content="getContent" type="full" :readonly="true" :minLines="1" :maxLines="1000"/>
  </va-card>
</template>

<style scoped>
  .aa-gap {
    margin: 5px;
  }
  .aa-pad {
    padding: 5px;
  }
</style>