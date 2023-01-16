import {jsonDeepEquality} from "./jsonDeepEquality";
import {extractRightSideChangesFromDiff} from "./extractRightSideChangesFromDiff";
import {parseDefaultFromContent} from "./parseDefaultFromContent";

export function addOverrideToJson(json: any, overrides: any, stage: string, region: string) {
    if(!("$overrides" in json)) {
        json.$overrides = {};
    }
    if(!(stage in json.$overrides)) {
        json.$overrides[stage] = {};
    }
    json.$overrides[stage][region] = overrides;
}

export function parseConfigIntoOverride(defaultAndOverridesJson: any, overriddenJson: any): any {

    // strip the $overrides metadata to get just the default content
    const defaultObject = parseDefaultFromContent(defaultAndOverridesJson);

    // get diff to determine what fields are overridden
    const diffObject: any = {};
    const equal = jsonDeepEquality(defaultObject, overriddenJson, diffObject);

    // no overrides, return undefined
    if(equal) {
        return undefined;
    }

    const overrides = extractRightSideChangesFromDiff(diffObject);

    return overrides;

}