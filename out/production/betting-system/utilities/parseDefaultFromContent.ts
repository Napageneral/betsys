
export function parseDefaultFromContent(defaultAndOverridesJson: any) {

    if(defaultAndOverridesJson === undefined) {
        return undefined;
    }

    // clone original content so we can modify it
    const defaultObject = JSON.parse(JSON.stringify(defaultAndOverridesJson, null, '\t'));

    // isolate default config by removing $overrides metadata
    delete defaultObject.$overrides;

    return defaultObject;
}