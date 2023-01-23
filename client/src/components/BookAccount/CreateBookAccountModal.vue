<script setup lang="ts">

import {inject, Ref, ref} from "vue";
import {useToast} from "vuestic-ui";
import {addBookAccount, updateBookAccount} from "@client/actions/BookAccount";
import {Status} from "@shared/constants";

  const toast = useToast();

  const props = defineProps<{
    mode: "Create" | "Update",
    playerid: string,
    BookName?: string,
    AccountBalance?: number,
    Username?: string,
    Password?: string,
    Email?: string,
    MarketLimits?: string,
    disabled?: boolean
  }>();

  const emit = defineEmits<{
    (e: "reloadBookAccounts"): void
  }>();

  let showModal = ref(false);
  function setShowModal() {
    showModal.value = true;
  }

  const BookNameRef = ref(props.BookName ?? "");
  const AccountBalanceRef = ref(props.AccountBalance ?? "");
  const UsernameRef = ref(props.Username ?? "");
  const PasswordRef = ref(props.Password ?? "");
  const EmailRef = ref(props.Email ?? "");
  const MarketLimitsRef = ref(props.MarketLimits ?? "");


  async function createThenClose(closeCallback: () => any) {
    const result = await addBookAccount(Number(props.playerid), BookNameRef.value, UsernameRef.value, EmailRef.value, PasswordRef.value).promise;
    let failed = false;

    // make sure the BookAccount was created successfully
    if(result.status !== Status.Success || result.error) {
      toast.init({
        message: "Add BookAccount failed: " + JSON.stringify(result.error),
        color: "danger",
        closeable: false
      });
      failed = true;
    }

    if(!failed) {
      toast.init({
        message: "Create BookAccount successful!",
        closeable: false
      });
      console.log(`Create BookAccount succeeded! emitting reload`);
      emit("reloadBookAccounts");
    }

    console.log(`Create BookAccount complete! calling close callback`);
    closeCallback();
  }

  function updateThenClose(closeCallback: () => any) {
    updateBookAccount(
        Number(props.playerid),
        BookNameRef.value,
        {
          PlayerID: Number(props.playerid),
          BookName: BookNameRef.value,
          Username: UsernameRef.value,
          Email: EmailRef.value,
          Password: PasswordRef.value,
          AccountBalance: AccountBalanceRef.value,
          MarketLimits: MarketLimitsRef.value
        }
    ).promise.then(function(result) {
      if(result.data) {
        toast.init({
          message: "Update BookAccount successful!",
          closeable: false
        });
        emit("reloadBookAccounts");
      } else {
        toast.init({
          message: "Update BookAccount failed!",
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
    return formRef.value?.validate();
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
          {{mode}} BookAccount
        </va-card-title>
        <va-card-content class="aa-modal-width">
          <va-form ref="formRef">
            <div class="aa-flex-col aa-pad-children">
              <va-input
                  v-model="BookNameRef"
                  label="Book Name"
              />
              <va-input
                  v-model="UsernameRef"
                  label="Username"
              />
              <va-input
                  v-model="PasswordRef"
                  label="Password"
              />
              <va-input
                  v-model="EmailRef"
                  label="Email"
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