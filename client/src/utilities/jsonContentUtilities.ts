import {computed, Ref} from "vue";
import {parseDefaultFromContent} from "../../../../shared/utilities/parseDefaultFromContent";
import {parseOverrideIntoConfig} from "../../../../shared/utilities/parseOverrideIntoConfig";

export function getJsonDefaultContent(content: Ref<any>) {
    return function() {
        return computed(function (): string | undefined {
            const newContent = parseDefaultFromContent(content.value);
            if (newContent === undefined) {
                return undefined;
            }
            return JSON.stringify(newContent, null, '\t');
        });
    }
}

export function getJsonOverriddenContentForStageAndRegion(content: Ref<any>, stage: Ref<string>, region: Ref<string>) {
    return function() {
        return computed(function (): string | undefined {
            const newContent = parseOverrideIntoConfig(content.value, stage.value, region.value);
            if (newContent === undefined) {
                return undefined;
            }
            return JSON.stringify(newContent, null, '\t');
        });
    }
}