<script setup lang="ts">
import ApplicationCard from "@client/components/ApplicationCard.vue";
import ApplicationCardSkeleton from "@client/components/skeletons/ApplicationCard.vue";
import CreateApplicationModal from "@client/components/CreateApplicationModal.vue";
import {listApplications} from "@client/actions/Application";
import {Application} from "../../../../shared/models/api/config/Application";
import {provide, ref, Ref} from "vue";

const applications: Ref<Application[] | undefined> = ref();
provide<Ref<Application[] | undefined>>('applications', applications);

function loadApplications() {
  const actionData = listApplications();
  actionData.promise.then(function() {
    applications.value = actionData.ref.value;
  });
}

loadApplications();

</script>

<template>
  <main>
    <div class="flex-container">
      <va-divider class="px-3" orientation="left">
        <span>Applications</span>
      </va-divider>
      <div class="flex-row flex-wrap">
        <template v-if="applications !== undefined">
          <template v-for="app of applications">
            <ApplicationCard
                :name="`${app.ApplicationName}`"
                :description="`${app.Description ?? 'Manage configs and deployments for the '+app.ApplicationName+' service.'}`"
                @reloadApps="loadApplications"
            />
          </template>
        </template>
        <template v-else>
          <ApplicationCardSkeleton/>
          <ApplicationCardSkeleton/>
          <ApplicationCardSkeleton/>
        </template>
        <!-- :disabled="applications === undefined" -->
        <CreateApplicationModal mode="Create" @reloadApps="loadApplications"/>
      </div>
      <va-divider class="px-3" orientation="left">
        <span>Console Tools</span>
      </va-divider>
      <div class="flex-row flex-wrap">
        <va-card color="#fbfbfb" class="landing-card" disabled>
          <va-card-title>
            <va-icon name="search" class="aa-button-colored aa-button-spaced"/>
            Something else
          </va-card-title>
          <va-card-content>
            Directly view the configs on a particular server host.
          </va-card-content>
          <va-card-actions align="stretch" vertical>
            <va-button round>View</va-button>
          </va-card-actions>
        </va-card>
      </div>
    </div>
  </main>
</template>

<style>
  .flex-container {
    display: flex;
    flex-direction: column;
  }
  .flex-row {
    display: flex;
    flex-direction: row;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }

  .va-divider__text {
    margin: 0 1rem 0 1rem;
  }

  .va-divider:before, .va-divider:after {
    width: 100%;
    background-color: #DDDDDD;
    height: 0.1rem;
  }
</style>