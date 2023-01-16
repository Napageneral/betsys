
/**
 * Given a stage, parse the json's __$overrides__ metadata to
 * generate a list of regions with overridden config content.
 * @param json - the json containing the __$overrides__ metadata
 * @param stage - dev, stg, rvw, prd
 */
export function getRegionsWithOverridesForStage(json: any, stage: string): string[] | undefined {

    // no json content passed in, return nothing
    if(json === undefined) {
        return undefined;
    }

    const overridesForStage = json.$overrides?.[stage];

    // there are no $overrides metadata or there are no overrides for this stage, return empty list
    if(overridesForStage === undefined) {
        return [];
    }

    const overriddenRegions: string[] = [];

    for(const regionName in overridesForStage) {
        overriddenRegions.push(regionName);
    }

    return overriddenRegions;

}

/**
 * Given a stage and region, parse the json's content and __$overrides__ metadata to
 * generate the overridden config content.
 * @param json - the json containing the default content and the __$overrides__ metadata
 * @param stage - dev, stg, rvw, prd
 * @param region - ue1, uw2, ...
 */
export function parseOverrideIntoConfig(json: any, stage: string | undefined, region: string | undefined) {

    // console.log("parseOverrideIntoConfig");
    // console.log("json", json);
    // console.log("stage", stage);
    // console.log("region", region);

    // no json content passed in, return nothing
    if(json === undefined) {
        return undefined;
    }
    // console.log("json", json);

    // there is no $overrides metadata, or overrides args are invalid, return original content
    if(json.$overrides === undefined || stage === undefined || region === undefined) {
        return json;
    }

    // clone original content so we can modify it
    const defaultObject = JSON.parse(JSON.stringify(json, null, '\t'));

    // pull out the override object from the override metadata
    const overrideObject = defaultObject?.$overrides?.[stage]?.[region];

    // overrides is just metadata, remove it so the actual configs dont end up with it
    delete defaultObject.$overrides;

    // json passed in has no overrides, return the default object
    if(overrideObject === undefined) {
        return defaultObject;
    }

    // compute the overridden version of the default object, which is the regional version
    addOrReplaceFields(defaultObject, overrideObject);

    // console.log("result", defaultObject);

    return defaultObject;
}

/**
 * Takes a json object representing the default values for a config, and overrides these
 * values with those present in the overridden json object.
 * @param defaultObject
 * @param overrideObject
 */
function addOrReplaceFields(defaultObject: any, overrideObject: any) {
    for(const key in overrideObject) {
        const originalValue = defaultObject[key];
        const value = overrideObject[key];
        if((typeof value) === 'object' && (typeof originalValue) === 'object') {
            addOrReplaceFields(originalValue, value);
        } else {
            // in primitives, the whole value is replaced
            // arrays are very sensitive to all changes but appending, so overrides must be whole arrays
            defaultObject[key] = value;
        }
    }
}