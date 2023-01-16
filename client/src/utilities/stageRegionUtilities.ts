import {
    regionLabelsForStage,
    stageLabels,
    ALL_STAGES,
    DEV_REGION_NICKNAMES,
    RVW_REGION_NICKNAMES,
    PRD_REGION_NICKNAMES, appleRegionsForStage
} from "../../../../shared/constants";

import {Ref} from "vue";

export function preventStaleRegionSelection(stage: Ref<string>, region: Ref<string>) {
    let found = false;
    for(const labelAndValue of (regionLabelsForStage as any)[stage.value]) {
        if(region.value === labelAndValue.value) {
            found = true;
        }
    }
    if(!found) {
        region.value = (regionLabelsForStage as any)[stage.value][0].value;
    }
}

export function getDefaultStage() {
    return stageLabels[0].value;
}

export function getDefaultRegionForStage(stage: string) {
    return (regionLabelsForStage as any)[stage][0].value;
}