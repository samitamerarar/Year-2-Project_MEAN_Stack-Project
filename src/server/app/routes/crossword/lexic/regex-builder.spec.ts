import { expect } from 'chai';
import { WordConstraint } from '../../../../../common/src/lexic/word-constraint';
import { RegexBuilder } from './regex-builder';

describe('RegexBuilder', () => {
    let regexBuilder: RegexBuilder;
    beforeEach(() => {
        regexBuilder = new RegexBuilder();
    });

    describe('buildFromConstraint', () => {
        it('should create an empty Regexp from an empty word constraint', (done) => {
            const emptyWordConstraint: WordConstraint = { charConstraints: [], isCommon: true, minLength: 0 };
            expect(regexBuilder.buildFromConstraint(emptyWordConstraint).source).equals('^$');
            expect(regexBuilder.buildFromConstraint(emptyWordConstraint).flags).equals('i');
            done();
        });
        it('should create a valid Regexp from a valid word constraint', (done) => {

            let validConstraint: WordConstraint, generatedRegex: RegExp;

            validConstraint = { charConstraints: [], isCommon: true, minLength: 3 };
            generatedRegex = regexBuilder.buildFromConstraint(validConstraint);
            expect(generatedRegex.source).equals('^.{3}$');
            expect(generatedRegex.flags).equals('i');

            validConstraint = { charConstraints: [{ char: 'a', position: 2 }], isCommon: true, minLength: 3 };
            generatedRegex = regexBuilder.buildFromConstraint(validConstraint);
            expect(generatedRegex.source).equals('^.{2}a$');
            expect(generatedRegex.flags).equals('i');

            validConstraint = { charConstraints: [{ char: 'b', position: 1 }], isCommon: true, minLength: 3 };
            generatedRegex = regexBuilder.buildFromConstraint(validConstraint);
            expect(generatedRegex.source).equals('^.{1}b.{1}$');
            expect(generatedRegex.flags).equals('i');

            validConstraint = { charConstraints: [{ char: 'c', position: 0 }], isCommon: true, minLength: 3 };
            generatedRegex = regexBuilder.buildFromConstraint(validConstraint);
            expect(generatedRegex.source).equals('^c.{2}$');
            expect(generatedRegex.flags).equals('i');

            validConstraint = { charConstraints: [{ char: 'd', position: 0 }, { char: 'b', position: 2 }], isCommon: true, minLength: 3 };
            generatedRegex = regexBuilder.buildFromConstraint(validConstraint);
            expect(generatedRegex.source).equals('^d.{1}b$');
            expect(generatedRegex.flags).equals('i');

            validConstraint = { charConstraints: [{ char: 'e', position: 1 }, { char: 'b', position: 2 }], isCommon: true, minLength: 3 };
            generatedRegex = regexBuilder.buildFromConstraint(validConstraint);
            expect(generatedRegex.source).equals('^.{1}eb$');
            expect(generatedRegex.flags).equals('i');

            validConstraint = {
                charConstraints: [{ char: 'f', position: 1 }, { char: 'b', position: 2 }],
                isCommon: true, minLength: 3, maxLength: 9
            };
            generatedRegex = regexBuilder.buildFromConstraint(validConstraint);
            expect(generatedRegex.source).equals('^.{1}fb.{0,6}$');
            expect(generatedRegex.flags).equals('i');

            done();
        });
        it('should return null with an invalid constraint', (done) => {
            let invalidWordConstraint: WordConstraint;
            invalidWordConstraint = {
                charConstraints: [{ char: 'a', position: 1 }, { char: 'b', position: 2 }],
                isCommon: true, minLength: 2
            };
            expect(regexBuilder.buildFromConstraint(invalidWordConstraint)).to.be.null;

            invalidWordConstraint = {
                charConstraints: [{ char: 'b', position: 1 }, { char: 'b', position: 2 }],
                isCommon: true, minLength: 2, maxLength: 1
            };
            expect(regexBuilder.buildFromConstraint(invalidWordConstraint)).to.be.null;

            invalidWordConstraint = {
                charConstraints: [{ char: 'c', position: 1 }, { char: 'b', position: 2 }],
                isCommon: true, minLength: -2, maxLength: 1
            };
            expect(regexBuilder.buildFromConstraint(invalidWordConstraint)).to.be.null;

            invalidWordConstraint = {
                charConstraints: [{ char: 'd', position: 1 }, { char: 'b', position: 2 }],
                isCommon: true, minLength: 2, maxLength: -1
            };
            expect(regexBuilder.buildFromConstraint(invalidWordConstraint)).to.be.null;

            invalidWordConstraint = {
                charConstraints: [{ char: 'e', position: 1 }, { char: 'b', position: 1 }],
                isCommon: true, minLength: 2
            };
            expect(regexBuilder.buildFromConstraint(invalidWordConstraint)).to.be.null;

            done();
        });
    });
});
