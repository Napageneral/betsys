import {Ref} from "vue";
import {ApiResponse} from "@client/models/api/ApiResponse";

export type ActionData<T> = {
    ref: Ref<T | undefined>,
    promise: Promise<ApiResponse>
}