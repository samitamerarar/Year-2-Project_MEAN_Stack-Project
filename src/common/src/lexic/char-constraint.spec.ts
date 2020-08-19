import { expect } from 'chai';
import { isCharConstraint } from './char-constraint';

function itShould(passOrFail: 'pass' | 'fail', message: string, ...objectsToTest: any[]) {
    it(`should ${passOrFail} ${message}`, (done) => {
        for (const OBJECT_TO_TEST of objectsToTest) {
            const FAIL_MESSAGE = `expected "${OBJECT_TO_TEST}" to ${passOrFail}`;
            const TEST_RESULT = isCharConstraint(OBJECT_TO_TEST) ? 'pass' : 'fail';
            expect(TEST_RESULT).to.equals(passOrFail, FAIL_MESSAGE);
        }
        done();
    });
}

function itShouldPass(message: string, ...objectsToTest: any[]) { itShould('pass', message, ...objectsToTest); }
function itShouldFail(message: string, ...objectsToTest: any[]) { itShould('fail', message, ...objectsToTest); }

describe('CharConstraint', () => {
    describe('has a function "isCharConstraint" that', () => {
        itShouldPass('a valid character constraint', {char: 'a', position: 0}, {char: 'z', position: 100000});
        itShouldFail('an object without a char or definition feild', {}, {foo: 'bar'}, {char: 'a'}, {position: 0});
        itShouldFail('an object with a number in its "char" feild', {char: 1, position: 0});
        itShouldFail('an object without a number in its position feild', {char: 'a', position: NaN}, {char: 'p', postion: 'lacasse'});
    });

});
