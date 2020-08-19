import { expect } from 'chai';
import { isWordConstraint } from './word-constraint';

function itShould(passOrFail: 'pass' | 'fail', message: string, ...objectsToTest: any[]) {
    it(`should ${passOrFail} ${message}`, (done) => {
        for (const OBJECT_TO_TEST of objectsToTest) {
            const FAIL_MESSAGE = `expected "${OBJECT_TO_TEST}" to ${passOrFail}`;
            const TEST_RESULT = isWordConstraint(OBJECT_TO_TEST) ? 'pass' : 'fail';
            expect(TEST_RESULT).to.equals(passOrFail, FAIL_MESSAGE);
        }
        done();
    });
}

function itShouldPass(message: string, ...objectsToTest: any[]) { itShould('pass', message, ...objectsToTest); }
function itShouldFail(message: string, ...objectsToTest: any[]) { itShould('fail', message, ...objectsToTest); }

describe('WordConstraint', () => {
    describe('has a function "isWordConstraint" that', () => {
        itShouldPass('a valid word',
            {minLength: 1, isCommon: true, charConstraints: []},
            {minLength: 1, isCommon: true, charConstraints: [{char: 'a', position: 0}, {char: 'z', position: 100000}]}
        );
        itShouldFail('an object without minLength', {isCommon: true, charConstraints: '[]'});
        itShouldFail('an object with invalid minLength', {minLength: NaN, isCommon: true, charConstraints: '[]'});
        itShouldFail('an object without charConstraints', {minLength: 1, isCommon: true});
        itShouldFail('an object without valid charConstraints', {minLength: 1, isCommon: true, charConstraints: null});
    });
});
