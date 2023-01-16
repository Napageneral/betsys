<script setup lang="ts">

</script>

<template>
  <va-card class="landing-card">
    <va-card-title class="aa-flex-row aa-flex-smallify-children">
      <div class="sk-grad sk-blue sk-text" style="flex-grow: 0.1;"/>
      <div class="sk-grad sk-text sk-spaced" style="flex-grow: 0.5;"/>
    </va-card-title>
    <va-card-content>
      <div class="sk-grad sk-thinbar" style="margin-top: 10px;"/>
      <div class="sk-grad sk-thinbar" style="width: 80%"/>
    </va-card-content>
    <va-spacer/>
    <va-card-actions align="stretch" vertical>
      <div class="sk-grad sk-button"/>
      <div class="vspacer"></div>
      <div class="sk-grad sk-button"/>
      <div class="vspacer"></div>
      <div class="sk-grad sk-button"/>
    </va-card-actions>
  </va-card>
</template>

<style scoped>
.aa-align-right {
  align-self: end;
}
.aa-full-width {
  flex-grow: 1;
}

.sk-thinbar {
  height: 18px;
  margin-bottom: 5px;
}
</style>