import { WordConstraint, isWordConstraint } from '../../../../../common/src/lexic/word-constraint';
import { CharConstraint } from '../../../../../common/src/lexic/char-constraint';

export class RegexBuilder {

    public buildFromConstraint(constraint: WordConstraint): RegExp {

        let regularExpression: string;
        regularExpression = '';

        if (isWordConstraint(constraint)) {

            constraint.maxLength = 'maxLength' in constraint ? constraint.maxLength : constraint.minLength;

            const SORTED_CHAR_CONSTRAINTS: CharConstraint[] = constraint.charConstraints.sort((a, b) => a.position - b.position);

            if (!this.checkConstraints(SORTED_CHAR_CONSTRAINTS, constraint)) {
                return null;
            }

            regularExpression += this.createRegex(regularExpression, SORTED_CHAR_CONSTRAINTS, constraint);

            const flags = 'i';
            const REG_EXP: RegExp = new RegExp(regularExpression, flags);

            return REG_EXP;
        } else {
            return null;
        }
    }

    private checkConstraints(sortedConstraints: CharConstraint[], constraint: WordConstraint): boolean {

        return (this.checkLengthConstraint(constraint)
            && this.checkDuplicates(sortedConstraints)
            && this.checkPositionConstraint(sortedConstraints, constraint));
    }

    private checkDuplicates(sortedConstraints: CharConstraint[]): boolean {

        let positionBuffer = -1;

        return sortedConstraints.every((constraint: CharConstraint) => {
            const predicate = constraint.position !== positionBuffer;
            positionBuffer = constraint.position;
            return predicate;
        });
    }

    private checkLengthConstraint(constraint: WordConstraint): boolean {

        return !(constraint.minLength > constraint.maxLength && constraint.minLength >= 0);
    }

    private checkPositionConstraint(sortedConstraints: CharConstraint[], constraint: WordConstraint): boolean {

        return !(sortedConstraints.length > 0
            && sortedConstraints[sortedConstraints.length - 1].position >= constraint.minLength);
    }

    private createRegex(regEx: string, sortedConstraints: CharConstraint[], constraint: WordConstraint): string {

        regEx = '^';

        let previous = -1;

        for (let i = 0; i < sortedConstraints.length; i++) {

            const CURRENT = sortedConstraints[i].position;

            if (CURRENT - previous > 1) {
                regEx += '.{' + (CURRENT - previous - 1) + '}';
            }

            regEx += sortedConstraints[i].char;
            previous = CURRENT;

        }

        if (previous <= constraint.minLength && constraint.maxLength > constraint.minLength) {
            regEx += '.{' + (constraint.minLength
                - previous - 1) + ','
                + (constraint.maxLength
                    - previous - 1) + '}$';
        } else if (previous === constraint.minLength - 1) {
            regEx += '$';
        } else if (previous !== constraint.minLength) {
            regEx += '.{' + (constraint.minLength
                - previous - 1) + '}$';
        }

        return regEx;
    }
}

