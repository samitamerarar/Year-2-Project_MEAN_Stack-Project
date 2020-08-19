import 'mocha';
import { expect } from 'chai';
import {
    isJson, toArrayBuffer, fromArrayBuffer,
    hasNativeAttributes, NativeAttributeDescriptor,
    hasAttributes, AttributeDescriptor,
    hasFunctions, FunctionDescriptor
} from './utils';

class MockClass1 { public readonly x: number; };
class MockClass2 { public readonly y: number; };

function describeFunction(functionName: string, callback: (this: Mocha.ISuiteCallbackContext) => void): Mocha.ISuite {
    return describe(`has a function #${functionName} that`, callback);
}

// Used to put a blank space between passing and failing tests in the output
function itSplitTests() {
    it('', (done) => done());
}

// Template for boolean-returning tests
function itShould(passOrFail: 'pass' | 'fail', message: string, ...stringsToTest: string[]) {
    it(`should ${passOrFail} ${message}`, () => {
        for (const stringToTest of stringsToTest) {
            const FAIL_MESSAGE = `expected "${stringToTest}" to ${passOrFail}`;
            const TEST_RESULT = isJson(stringToTest) ? 'pass' : 'fail';
            expect(TEST_RESULT).to.equals(passOrFail, FAIL_MESSAGE);
        }
    });
}

function itShouldPass(message: string, ...stringToTest: string[]) { itShould('pass', message, ...stringToTest); }
function itShouldFail(message: string, ...stringToTest: string[]) { itShould('fail', message, ...stringToTest); }

interface Test<A, R> {
    it: string;
    cases: TestCase<A, R>[];
}
interface TestCase<A, R> {
    arguments: A[];
    expectation: R;
}
type TestableFunction<A = any, R = any> = (...args: A[]) => R;
type ResultComparer<R1, R2 extends R1 = R1> = (result1: R1, result2: R2) => boolean;

function applyTestsTo<A, R>(functionToTest: TestableFunction<A, R>, resultComparer: ResultComparer<R>, ...tests: Test<A, R>[]) {
    for (const test of tests) {
        it(test.it, (done) => {
            for (const testCase of test.cases) {
                const result = functionToTest(...testCase.arguments);
                expect(result)
                    .to.satisfy((value: R) => resultComparer(value, testCase.expectation));
            }
            done();
        });
    }
}

describe('The Utility library', () => {
    describeFunction('isJson', () => {
        itShouldPass('a number', '0', '42', '-21', '3.14159265359');
        itShouldPass('a string', '""', '"Hello World!"', '"§¯µ¶@#£¢¤¬`°«»"');
        itShouldPass('an empty JSON Object string', '{}');
        itShouldPass('an empty JSON Array string', '[]');
        itShouldPass('a JSON Object with a null filed', '{"myNull": null}');
        itShouldPass('a JSON Object with a number field', '{"x": 0}', '{"answer": 21}', '{"budget": -2000}');
        itShouldPass('a JSON Object with a string field', '{"name": "Jon Doe"}');
        itShouldPass('a JSON Object with a boolean field', '{"passes": true}', '{"failes": false}');
        itShouldPass('a JSON Object with an Array field', '{"friends": []}', '{"Homer Simpson": ["Donut", "Donut", "Donut", "..."]}');
        itShouldPass('a nested JSON Object', '{"my":{"beautiful":{"nested":{"object":{}}}}}');
        itShouldPass('a JSON Array that contains null', '[null]', '[null, null, null]');
        itShouldPass('a JSON Array that contains numbers', '[0]', '[-1, 1]', '[42, 10000]');
        itSplitTests(); // Section separation
        itShouldFail('an empty string', '');
        itShouldFail('an invalid string', '\'\'', '"', '\'');
        itShouldFail('an a string containing non-matching (square) brackets', '{}}', '[[]');
        itShouldFail('empty Object/Array with commas', '{,}', '[,]', '{,,,,,,,}', '[,,,,,,,]');
        itShouldFail('valid JavaScript (pseudo-)numbers', 'Infinity', '-Infinity', 'NaN');
    });

    const fillArrayBuffer = (buffer: ArrayBuffer, ...bytes: number[]): typeof buffer => {
        let i = 0;
        const view = new DataView(buffer);
        for (const byte of bytes) { view.setUint16(2 * i++, byte, true); }
        return buffer;
    };

    const basicComparer = <T = any>(s1: T, s2: T) => s1 === s2;
    const arrayBufferComparer = (buffer1: ArrayBuffer, buffer2: ArrayBuffer) => {
        if (buffer1.byteLength !== buffer2.byteLength) {
            return false;
        }
        const view1 = new DataView(buffer1), view2 = new DataView(buffer2);
        for (let i = 0; i < buffer1.byteLength; ++i) {
            if (view1.getUint8(i) !== view2.getUint8(i)) {
                return false;
            }
        }
        return true;
    };

    const getCharCodes = (str: string) => str.split('').map((char) => char.charCodeAt(0));

    describeFunction('toArrayBuffer', () => {
        const BYTES1 = [0xCA, 0xFE, 0xBA, 0xBE];
        const BYTES2 = [0xA5];
        const BYTES3 = [0xDE, 0xAD, 0xBE, 0xEF];
        const STRING = 'hello';
        const TESTS: Test<String, ArrayBuffer>[] = [
            {
                it: 'should return an empty buffer when given an empty string',
                cases: [
                    {
                        arguments: [''],
                        expectation: fillArrayBuffer(new ArrayBuffer(0))
                    }
                ]
            },
            {
                it: 'should encode a given string',
                cases: [
                    {
                        arguments: [String.fromCharCode(...BYTES1)],
                        expectation: fillArrayBuffer(new ArrayBuffer(2 * BYTES1.length), ...BYTES1)
                    },
                    {
                        arguments: [String.fromCharCode(...BYTES2)],
                        expectation: fillArrayBuffer(new ArrayBuffer(2 * BYTES2.length), ...BYTES2)
                    },
                    {
                        arguments: [String.fromCharCode(...BYTES3)],
                        expectation: fillArrayBuffer(new ArrayBuffer(2 * BYTES3.length), ...BYTES3)
                    },
                    {
                        arguments: [STRING],
                        expectation: fillArrayBuffer(new ArrayBuffer(2 * STRING.length),
                            ...getCharCodes(STRING))
                    }
                ]
            }
        ];
        applyTestsTo(toArrayBuffer, arrayBufferComparer, ...TESTS);
    });

    describeFunction('fromArrayBuffer', () => {
        const STRING1 = 'hello';
        const BYTES1 = getCharCodes(STRING1);
        const STRING2 = '§¯µ¶@#£¢¤¬`°«»';
        const BYTES2 = getCharCodes(STRING2);
        const TESTS: Test<ArrayBuffer, string>[] = [
            {
                it: 'should deserialize a buffer into a string',
                cases: [
                    {
                        arguments: [fillArrayBuffer(new ArrayBuffer(2 * BYTES1.length), ...BYTES1)],
                        expectation: STRING1
                    },
                    {
                        arguments: [fillArrayBuffer(new ArrayBuffer(2 * BYTES2.length), ...BYTES2)],
                        expectation: STRING2
                    }
                ]
            }
        ];
        applyTestsTo(fromArrayBuffer, basicComparer, ...TESTS);
    });

    describeFunction('hasNativeAttributes', () => {
        const TESTS: Test<any | NativeAttributeDescriptor[], boolean>[] = [
            {
                it: 'should pass an object containing at least the required fields',
                cases: [
                    {
                        arguments: [{ 'foo': 42, 'bar': 'world' }, [
                            { name: 'foo', type: 'number' },
                            { name: 'bar', type: 'string' }
                        ]],
                        expectation: true
                    },
                    {
                        arguments: [{ 'foo': 42, 'bar': 'world', 'baz': false }, [
                            { name: 'foo', type: 'number' },
                            { name: 'bar', type: 'string' }
                        ]],
                        expectation: true
                    }
                ]
            },
            {
                it: 'should fail an object missing as least a required field',
                cases: [
                    {
                        arguments: [{ 'foo': 42 }, [
                            { name: 'foo', type: 'number' },
                            { name: 'bar', type: 'string' }
                        ]],
                        expectation: false
                    }
                ]
            },
            {
                it: 'should fail an object with a mismatching field',
                cases: [
                    {
                        arguments: [{ 'foo': 42, 'bar': true }, [
                            { name: 'foo', type: 'number' },
                            { name: 'bar', type: 'string' }
                        ]],
                        expectation: false
                    }
                ]
            }
        ];
        applyTestsTo(hasNativeAttributes, basicComparer, ...TESTS);
    });

    describeFunction('hasAttributes', () => {
        const TESTS: Test<any | AttributeDescriptor[], boolean>[] = [
            {
                it: 'should pass an object containing at least the required fields',
                cases: [
                    {
                        arguments: [{ 'foo': new MockClass1, 'bar': new MockClass2 }, [
                            { name: 'foo', parent: MockClass1 },
                            { name: 'bar', parent: MockClass2 }
                        ]],
                        expectation: true
                    },
                    {
                        arguments: [{ 'foo': new MockClass1, 'bar': new MockClass2, 'baz': false }, [
                            { name: 'foo', parent: MockClass1 },
                            { name: 'bar', parent: MockClass2 }
                        ]],
                        expectation: true
                    }
                ]
            },
            {
                it: 'should fail an object missing as least a required field',
                cases: [
                    {
                        arguments: [{ 'foo': new MockClass1 }, [
                            { name: 'foo', parent: MockClass1 },
                            { name: 'bar', parent: MockClass2 }
                        ]],
                        expectation: false
                    }
                ]
            },
            {
                it: 'should fail an object with a mismatching field',
                cases: [
                    {
                        arguments: [{ 'foo': new MockClass1, 'bar': new MockClass1 }, [
                            { name: 'foo', parent: MockClass1 },
                            { name: 'bar', parent: MockClass2 }
                        ]],
                        expectation: false
                    }
                ]
            }
        ];
        applyTestsTo(hasAttributes, basicComparer, ...TESTS);
    });

    describeFunction('hasFunctions', () => {
        // tslint:disable-next-line:no-empty
        const function1 = (x: void) => { };
        // tslint:disable-next-line:no-empty
        const function2 = (x: void, y: void) => { };
        const TESTS: Test<any | FunctionDescriptor[], boolean>[] = [
            {
                it: 'should pass an object containing at least the required functions',
                cases: [
                    {
                        arguments: [{ 'foo': function1, 'bar': function2 }, [
                            { name: 'foo', parameterCount: 1 },
                            { name: 'bar', parameterCount: 2 }
                        ]],
                        expectation: true
                    },
                    {
                        // tslint:disable-next-line:no-empty
                        arguments: [{ 'foo': function1, 'bar': function2, 'baz': () => { } }, [
                            { name: 'foo', parameterCount: 1 },
                            { name: 'bar', parameterCount: 2 }
                        ]],
                        expectation: true
                    }
                ]
            },
            {
                it: 'should fail an object missing as least a required function',
                cases: [
                    {
                        arguments: [{ 'foo': function1 }, [
                            { name: 'foo', parameterCount: 1 },
                            { name: 'bar', parameterCount: 2 }
                        ]],
                        expectation: false
                    }
                ]
            },
            {
                it: 'should fail an object with a mismatching function',
                cases: [
                    {
                        arguments: [{ 'foo': function1, 'bar': function1 }, [
                            { name: 'foo', parameterCount: 1 },
                            { name: 'bar', parameterCount: 2 }
                        ]],
                        expectation: false
                    }
                ]
            }
        ];
        applyTestsTo(hasFunctions, basicComparer, ...TESTS);
    });
});
