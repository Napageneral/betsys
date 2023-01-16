<script setup lang="ts">

  import CreateApplicationModal from "@client/components/CreateApplicationModal.vue";
  import {useRouter} from "vue-router";

  const router = useRouter();

  const props = defineProps<{
    name: string,
    description: string
  }>();

  const emit = defineEmits<{
    (e: 'reloadApps'): void
  }>();

</script>

<template>
  <va-card class="landing-card aa-clickable" @click="router.push(`/app/${name}`)">
    <va-card-title class="aa-flex-row aa-flex-smallify-children">
      <div>
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
      </div>
      {{ name }}
      <div class="aa-full-width"/>
      <CreateApplicationModal mode="Update" class="aa-align-right" :name="name" :description="description" @reloadApps="emit('reloadApps')"/>
    </va-card-title>
    <va-card-content>
      {{ description }}
    </va-card-content>
    <va-spacer/>
    <va-card-actions align="stretch" vertical>
      <va-button :to="`/app/${name}?tab=Configs`" round>Configs</va-button>
      <div class="vspacer"></div>
      <va-button :to="`/app/${name}?tab=Deployments`" round>Deployments</va-button>
      <div class="vspacer"></div>
      <va-button :to="`/app/${name}?tab=Environments`" round>Environments</va-button>
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
.aa-clickable {
  cursor: pointer;
}
</style>