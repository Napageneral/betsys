import Ajv, {ValidateFunction} from "ajv/dist/2020";

export type ValidationMessage = {
    instancePath: string;
    message: string;
    schemaPath: string;
};

export type ValidationSection = {
    title: string,
    passed: boolean;
    messages: ValidationMessage[];
};

export function validationWasSuccessful(validationResults: ValidationSection[]) {
    for(const validationSection of validationResults) {
        if(validationSection.passed === false) {
            return false;
        }
    }
    return true;
}

export function getOnlyFailureMessages(validationResults: ValidationSection[]): ValidationSection[] {
    let failures: ValidationSection[] = [];
    for(const validationSection of validationResults) {
        if(!validationSection.passed) {
            failures.push(validationSection);
        }
    }
    if(failures.length === 0) {
        failures.push({
            title: "Success",
            passed: false,
            messages: [{
                instancePath: "",
                message: "All validations succeeded",
                schemaPath: ""
            }]
        });
    }
    return failures;
}

export function validateJsonAsAFullSection(title: string, jsonStr: string, validationResults: ValidationSection[]): any {
    const result: ValidationSection = {
        title: title,
        passed: false,
        messages: []
    }
    const json = getAndValidateJson(jsonStr, result);
    validationResults.push(result);
    return json;
}

export function getAndValidateJson(jsonStr: string, validationSection: ValidationSection) {
    try {
        const json = JSON.parse(jsonStr);

        validationSection.passed = true;
        validationSection.messages.push({
            instancePath: "",
            message: "JSON is valid",
            schemaPath: ""
        });

        return json;
    } catch(error: any) {
        validationSection.passed = false;
        validationSection.messages.push(
            {
                instancePath: "",
                message: "invalid JSON syntax: " + (error?.message ?? error),
                schemaPath: "json parser"
            }
        );
    }
    return undefined;
}

export function validateSchemaAndCompileValidationFunction(title: string, ajv: Ajv, schemaStr: string, validationResults: ValidationSection[]): ValidateFunction | undefined {
    const result: ValidationSection = {
        title: title,
        passed: false,
        messages: []
    }
    let validate: ValidateFunction | undefined = undefined;
    let schemaJson: any = getAndValidateJson(schemaStr, result);
    if(schemaJson !== undefined) {
        const valid = ajv.validateSchema(schemaJson);
        if(valid) {

            try {
                validate = ajv.compile(schemaJson);
            } catch(error: any) {
                result.passed = false;
                result.messages.push(
                    {
                        instancePath: "",
                        message: "invalid JSON Schema syntax: " + (error?.message ?? error),
                        schemaPath: "json parser"
                    }
                );
            }

        } else {
            result.passed = false;
            //@ts-ignore
            result.messages = ajv.errors;
            //console.log("schema errors:", result.messages);
        }
    }

    validationResults.push(result);

    return validate;
}

export function validateJsonAgainstSchema(title: string, validate: ValidateFunction<unknown>, jsonStrOrObj: string | any, validationResults: ValidationSection[]) {
    const result: ValidationSection = {
        title: title,
        passed: false,
        messages: []
    }

    let json = jsonStrOrObj;
    if(typeof json === 'string') {
        json = getAndValidateJson(jsonStrOrObj, result);
    }
    if(json !== undefined) {

        const valid = validate(json);

        if (valid) {
            result.passed = true;
            result.messages.push({
                instancePath: "",
                message: "JSON is valid and conforms to schema",
                schemaPath: ""
            });
        } else {
            result.passed = false;
            //@ts-ignore
            for (let errorObj of validate.errors) {
                result.messages.push(errorObj as ValidationMessage);
            }
        }
    }
    validationResults.push(result);
    return result;
}