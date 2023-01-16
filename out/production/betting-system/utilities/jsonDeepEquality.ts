export function getTypeForDeepEquality(value: any): string {
    if(Array.isArray(value)) {
        return 'array';
    } else if(typeof value === 'object') {
        return 'object';
    }
    return typeof value;
}

export function jsonDeepEquality(left: any, right: any, diffObj: any = {}) {
    return anyDeepEquality(left, right, diffObj);
}

function anyDeepEquality(left: any, right: any, diffObj: any) {
    const leftType = getTypeForDeepEquality(left);
    const rightType = getTypeForDeepEquality(right);

    if(leftType !== rightType) {
        diffObj.equalType = false;
        diffObj.leftType = leftType;
        diffObj.rightType = rightType;
        diffObj.equal = false;
        diffObj.left = left;
        diffObj.right = right;
        return false;
    } else {
        diffObj.equalType = true;
        diffObj.type = leftType;
    }

    if(leftType === 'array') {
        const childDiffObj: any = {};
        diffObj.equal = arrayDeepEquality(left, right, childDiffObj);
        if(diffObj.equal) {
            diffObj.both = left;
        } else {
            diffObj.both = childDiffObj;
        }
    } else if(leftType === 'object') {
        const childDiffObj: any = {};
        diffObj.equal = objectDeepEquality(left, right, childDiffObj);
        if(diffObj.equal) {
            diffObj.both = left;
        } else {
            diffObj.both = childDiffObj;
        }
    } else {
        diffObj.equal = left === right;
        if(diffObj.equal) {
            diffObj.both = left;
        } else {
            diffObj.left = left;
            diffObj.right = right;
        }
    }
    return diffObj.equal;
}

function objectDeepEquality(leftObject: any, rightObject: any, diffObj: any) {
    const fields = new Set([...Object.getOwnPropertyNames(leftObject), ...Object.getOwnPropertyNames(rightObject)]);
    let equal = true;
    for(const field of fields) {
        const leftValue  = leftObject[field];
        const rightValue = rightObject[field];
        const childDiffObj = {};
        if(!anyDeepEquality(leftValue, rightValue, childDiffObj)) {
            equal = false;
        }
        diffObj[field] = childDiffObj;
    }
    return equal;
}

function arrayDeepEquality(leftArray: Array<any>, rightArray: Array<any>, diffObj: any) {
    let equal = true;
    if(leftArray.length != rightArray.length) {
        equal = false;
    }
    for(let i = 0; i < leftArray.length; i++) {
        let leftElement = i < leftArray.length? leftArray[i] : undefined;
        let rightElement = i < rightArray.length? rightArray[i] : undefined;
        let childDiffObj = {};
        if(!anyDeepEquality(leftElement, rightElement, childDiffObj)) {
            equal = false;
        }
        diffObj[i] = childDiffObj;
    }
    return equal;
}