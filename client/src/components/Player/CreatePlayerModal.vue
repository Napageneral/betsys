<script setup lang="ts">

import {inject, Ref, ref} from "vue";
import {useToast} from "vuestic-ui";
import {addPlayer, updatePlayer} from "@client/actions/Player";
import {Player} from "@shared/models/Player";
import {Status} from "@shared/constants";

  const toast = useToast();

  const props = defineProps<{
    mode: "Create" | "Update",
    firstName?: string,
    lastName?: string,
    ssn?: string,
    homeAddress?: string,
    playerID?: number,
    disabled?: boolean
  }>();

  const emit = defineEmits<{
    (e: "reloadPlayers"): void
  }>();

  let showModal = ref(false);
  function setShowModal() {
    showModal.value = true;
  }

  const Players = inject<Ref<Player[] | undefined>>('Players', ref());

  const playerIDRef = ref(props.playerID ?? 0);
  const firstNameRef = ref(props.firstName ?? "");
  const lastNameRef = ref(props.lastName ?? "");
  const SSNRef = ref(props.ssn ?? "");
  const homeAddressRef = ref(props.homeAddress ?? "");

  const nameConstraints = (props.mode === 'Create')? [
    makeStringLengthBoundsConstraint(1, 64)
  ] : [];

const SSNConstraints = (props.mode === 'Create')? [
  isSSNUnique,
  makeStringLengthBoundsConstraint(9, 9)
] : [];


  function makeStringLengthBoundsConstraint(lower: number, upper: number): (value: string) => true | string {
    return function(value: string): true | string {
      return (value.length >= lower && value.length <= upper)? true : `Number of characters must be in range [${lower}-${upper}]`;
    }
  }

  function isSSNUnique(SSN: string): true | string {
    if(Players.value === undefined) {
      return "Can't verify uniqueness due to connection issues";
    }
    for(const Player of Players.value) {
      if(Player.SSN === SSN) {
        return "SSN must be unique";
      }
    }
    return true;
  }

  async function createThenClose(closeCallback: () => any) {
    const result = await addPlayer(firstNameRef.value, lastNameRef.value, SSNRef.value, homeAddressRef.value).promise;
    let failed = false;

    // make sure the Player was created successfully
    if(result.status !== Status.Success || result.error) {
      toast.init({
        message: "Add Player failed: " + JSON.stringify(result.error),
        color: "danger",
        closeable: false
      });
      failed = true;
    }

    if(!failed) {
      toast.init({
        message: "Create Player successful!",
        closeable: false
      });
      console.log(`Create Player succeeded! emitting reload`);
      emit("reloadPlayers");
    }

    console.log(`Create Player complete! calling close callback`);
    closeCallback();
  }

  function updateThenClose(closeCallback: () => any) {
    updatePlayer(
        playerIDRef.value,
        {
          PlayerID: playerIDRef.value,
          FirstName: firstNameRef.value,
          LastName: lastNameRef.value,
          HomeAddress: homeAddressRef.value,
          SSN: SSNRef.value
        }
    ).promise.then(function(result) {
      if(result.data) {
        toast.init({
          message: "Update Player successful!",
          closeable: false
        });
        emit("reloadPlayers");
      } else {
        toast.init({
          message: "Update Player failed!",
          color: "danger",
          closeable: false
        });
      }
    });
    closeCallback();
  }

  const formRef = ref();

  function validate(): boolean {
    // make sure all the form rules are met
    if(!formRef.value?.validate()) {
      return false;
    }
    // make sure the Player has changed, if not, then there is no update to make
    if(props.mode === 'Update' && props.homeAddress === homeAddressRef.value) {
      return false;
    }
    return true;
  }

  function actionThenClose(closeCallback: () => any) {
    if(!validate()) {
      console.log("validation result was false");
      return false;
    }
    if(props.mode === "Create") {
      createThenClose(closeCallback);
    } else {
      updateThenClose(closeCallback);
    }
  }

</script>

<template>
  <div :class="(mode === 'Create') ? 'aa-align-with-cards' : ''">
    <template v-if="mode === 'Create'">
      <va-button @click.stop="setShowModal" size="small" class="aa-big-round-button" :disabled="disabled" round>
        <va-icon name="add"/>
      </va-button>
    </template>
    <template v-else>
      <div @click.stop="setShowModal" size="small" class="aa-medium-round-button" :disabled="disabled">
        <va-icon name="more_vert"/>
      </div>
    </template>
    <va-modal
        v-model="showModal"
        size="large"
        no-padding
    >
      <template #content="{ ok, cancel }">
        <va-card-title>
          {{mode}} Player
        </va-card-title>
        <va-card-content class="aa-modal-width">
          <va-form ref="formRef">
            <div class="aa-flex-col aa-pad-children">
              <va-input
                  v-model="firstNameRef"
                  label="First Name"
                  :rules="nameConstraints"
              />
              <va-input
                  v-model="lastNameRef"
                  label="Last Name"
                  :rules="nameConstraints"
              />
              <va-input
                  v-model="homeAddressRef"
                  label="Home Address"
                  type="textarea"
                  autosize
              />
              <va-input
                  v-model="SSNRef"
                  label="SSN"
                  :rules="SSNConstraints"
              />
            </div>
          </va-form>
        </va-card-content>
        <va-card-actions class="aa-modal-buttons-align">
          <div class="aa-flex-row aa-flex-smallify-children aa-align-right aa-full-width">
            <va-button @click="cancel" outline round>Cancel</va-button>
            <va-button @click="actionThenClose(ok)" :disabled="!validate()" round>{{ mode }}</va-button>
          </div>
        </va-card-actions>
      </template>
    </va-modal>
  </div>
</template>

<style scoped>

  .aa-align-with-cards {
    padding-top: 15px;
  }

  .aa-big-round-button {
    height: 40px;
    width: 40px;
    border-radius: 40px;
    background-color: var(--vt-c-primary-color);
  }

  .aa-medium-round-button {
    height: 30px;
    width: 30px;
    border-radius: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #888888;
  }

  .aa-medium-round-button:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .aa-pad-children > * {
    padding-top: 5px;
  }

  .aa-modal-width {
    min-width: 500px;
  }

  .aa-modal-buttons-align {
    align-items: end;
  }

  .aa-full-width {
    width: 100%;
  }
</style>