
/**
 * This utility function exists because Express formats Maps poorly
 * @param map - the map to convert to a native object representation
 */
export function mapToObject<T>(map: Map<string, T> | undefined) {
    if(map === undefined) {
        return undefined;
    }
    const ob: any = {};
    for(const [key, value] of map.entries()) {
        ob[key] = value;
    }
    return ob;
}