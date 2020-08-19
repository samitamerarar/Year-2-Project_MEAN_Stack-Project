import { CharConstraint, isCharConstraint } from './char-constraint';
import { isJson } from '../utils';

export class WordConstraint {
    public charConstraints: CharConstraint[];
    public isCommon?: boolean;
    public minLength: number;
    public maxLength?: number;
}

function isCharConstraintArray(object: any): object is CharConstraint[] {
    return Array.isArray(object) &&
        object.every((element: any) => isCharConstraint(element));
}

export function isWordConstraint(object: any): boolean {
    return ('minLength' in object && Number.isInteger(object['minLength'])) && (
        'charConstraints' in object &&
        isCharConstraintArray(object['charConstraints'])
    );
}

export function parseWordConstraint(pseudoWordConstraint: any): WordConstraint {
    if (!isWordConstraint(pseudoWordConstraint) ||
        (
            typeof pseudoWordConstraint === 'string' &&
            isJson(pseudoWordConstraint) &&
            !isWordConstraint(JSON.parse(pseudoWordConstraint))
        )
    ) {
        throw new SyntaxError('Passed object is not a WordConstraint');
    }
    let parsedJson: any;
    if (typeof pseudoWordConstraint === 'string') {
        parsedJson = JSON.parse(pseudoWordConstraint);
    } else {
        parsedJson = pseudoWordConstraint;
    }
    return <WordConstraint>{
        minLength: Number(parsedJson.minLength),
        maxLength: 'maxLength' in parsedJson ? Number(parsedJson.maxLength) : null,
        isCommon: 'isCommon' in parsedJson && parsedJson.isCommon !== undefined ? Boolean(parsedJson.isCommon) : null,
        charConstraints: parsedJson.charConstraints
    };
}
