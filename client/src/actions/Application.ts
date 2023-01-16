import {Status} from "../../../../shared/constants";
import {ActionType, Api} from "@client/constants/constants";
import {ActionData} from "@client/actions/ActionData";

import {
    Application, CreateApplicationRequest, DeleteApplicationRequest, GetApplicationRequest, GetApplicationResponse,
    ListApplicationsRequest, UpdateApplicationRequest
} from "../../../../shared/models/api/config/Application";
import {addErrorToast, handleApiPost} from "@client/utilities/utilities";
import {Ref, ref} from "vue";

const APPLICATION_PATH = Api.Host + Api.Config.Base + Api.Config.Resource.Application;

export function listApplications(): ActionData<Array<Application>> {
    const listApplicationsRequest : ListApplicationsRequest = {
    };
    const applications = ref();
    const promise = handleApiPost(APPLICATION_PATH + ActionType.List, listApplicationsRequest).then((result)=>{
        applications.value = result.data?.Applications;
        return result;
    });
    return {
        ref: applications,
        promise: promise
    };
}

export function createApplication(applicationName: string, description: string, regions?: string[]): ActionData<Application> {
    const createApplicationInput : CreateApplicationRequest = {
        ApplicationName: applicationName,
        Description: description
    }
    const application = ref()
    const promise = handleApiPost(APPLICATION_PATH + ActionType.Create, createApplicationInput).then((result)=>{
        if(result.error !== undefined) {
            application.value = result.data?.Application;
        }
        //addErrorToast("", title?: string)
        return result;
    });
    return {
        ref: application,
        promise: promise
    };
}

export function updateApplication(sourceApplicationName: string, updatedApplication: Application): ActionData<Application> {
    const updateApplicationInput : UpdateApplicationRequest = {
        Application: updatedApplication,
        ApplicationName: sourceApplicationName
    }
    const application = ref()
    const promise = handleApiPost(APPLICATION_PATH + ActionType.Update, updateApplicationInput).then((result)=>{
        application.value = result.data?.Application;
        return result;
    });
    return {
        ref: application,
        promise: promise
    };
}

export function deleteApplication(applicationName: string): Ref<boolean> {
    const deleteApplicationInput : DeleteApplicationRequest = {
        ApplicationName: applicationName
    }
    const success = ref(false)
    handleApiPost(APPLICATION_PATH + ActionType.Delete, deleteApplicationInput).then((result)=>{
        if(result.status == Status.DeleteSuccess) {
            success.value = true;
        }
    });
    /*this.handleToasting(result.error, "List applications");*/
    return success;
}

export function getApplication(applicationName: string): Ref<Application> {
    const getApplicationInput : GetApplicationRequest = {
        ApplicationName: applicationName
    }
    const application = ref()
    handleApiPost(APPLICATION_PATH + ActionType.Get, getApplicationInput).then((result)=>{
        application.value = result.data.Application;
    });
    /*this.handleToasting(result.error, "List applications");*/
    return application;
}