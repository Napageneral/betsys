
export function extractRightSideChangesFromDiff(diffObject: any) {
    if(diffObject.equal) {
        return undefined;
    }
    return extractRightSideChangesFromAny(diffObject);
}

function extractRightSideChangesFromAny(diffAny: any) {
    if(diffAny.equal) {
        console.error("Illegal State: Trying to extract right side of shared value!");
        return undefined;
    }
    // if the left and right aren't the same type, they are completely unequal, and thus not stored as diff objects
    if(diffAny.equalType === false) {
        return diffAny.right;

        // otherwise, depending on type we need to recurse to extract the right side from child diff objects
    } else {
        const type = diffAny.type;
        if (type === 'array') {
            return extractRightSideChangesFromArray(diffAny.both);
        } else if (type === 'object') {
            return extractRightSideChangesFromObject(diffAny.both);
        } else {
            return diffAny.right;
        }
    }
}

function extractRightSideChangesFromObject(diffObject: any) {
    const rightSideObject: any = {};
    for(const field in diffObject) {
        if(!diffObject[field].equal) {
            const rhs = extractRightSideChangesFromAny(diffObject[field]);
            if (rhs !== undefined) {
                rightSideObject[field] = rhs;
            }
        }
    }
    return rightSideObject;
}

/**
 * extracts the right side changes of the diff
 * @param diffArrayObject
 */
function extractRightSideChangesFromArray(diffArrayObject: any) {
    const rightSideArray: any[] = [];
    let currentIndex = 0;
    let inBounds = true;
    while(inBounds) {
        inBounds = currentIndex.toString() in diffArrayObject;
        if(inBounds) {
            const itemDiffObject = diffArrayObject[currentIndex.toString()];
            if(itemDiffObject.equal) {
                rightSideArray.push(itemDiffObject.both);
            } else {
                const rhs = extractRightSideChangesFromAny(itemDiffObject);
                inBounds = rhs !== undefined;
                if (inBounds) {
                    rightSideArray.push(rhs);
                    currentIndex++;
                }
            }
        }
    }
    return rightSideArray;
}