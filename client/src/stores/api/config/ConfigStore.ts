import {computed, ComputedRef, ref} from "vue";
import { defineStore } from "pinia";

import * as UserDataActions from "@client/stores/api/config/storeActions/UserData";

export const useStore = defineStore({
    id: "ConfigStore",
    state: () => ({
        userData: {}
    }),
    getters: {
        getUserData: function(state) {
            return function(): ComputedRef<any | undefined> {
                return computed(function() {
                    return state.userData;
                });
            };
        }
    },
    actions: {
        ...UserDataActions
    }
});
