<script setup>
  defineProps({
    name: String,
    description: String
  })
</script>

<template>
  <va-card class="landing-card" :to="`/app/${name}`">
    <va-card-title>
      <img
          alt="server stack"
          class="logo"
          src="@client/assets/server.svg"
          width="20.9636"
          style="
              filter: invert(47%) sepia(24%) saturate(5830%) hue-rotate(193deg) brightness(92%) contrast(90%);
              margin-right: 10px;
            "
      />
      {{ name }}
    </va-card-title>
    <va-card-content>
      {{ description }}
    </va-card-content>
    <va-spacer/>
    <va-card-actions align="stretch" vertical>
      <va-button :to="`/app/${name}?tab=Configs`" round>Configs</va-button>
      <div class="vspacer"></div>
      <va-button :to="`/app/${name}?tab=Environments`" round>Environments</va-button>
    </va-card-actions>
  </va-card>
</template>

<style>
</style>