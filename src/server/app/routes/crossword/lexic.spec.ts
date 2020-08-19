import { Lexic } from './lexic';
import { expect } from 'chai';
import { Db } from 'mongodb';
import { WordConstraint } from '../../../../common/src/lexic/word-constraint';
import { provideDatabase } from '../../app-db';
import { RegexBuilder } from './lexic/regex-builder';
import { ExternalWordApiService } from './lexic/external-word-api.service';

const DB_PROVIDER: Promise<Db> = provideDatabase();
const RX_BUILDER = new RegexBuilder();

class ExternalWordApiServiceMock extends ExternalWordApiService {

    private readonly mockDefinitions: { [index: string]: string[] } = {
        banana: ['fruit', 'boomrang-like object']
    };

    constructor() {
        super();
    }

    public getDefinitions(word: string): Promise<string[]> {
        if (word in this.mockDefinitions) {
            return Promise.resolve(this.mockDefinitions[word]);
        } else {
            return Promise.reject(new Error('word not found'));
        }
    }
}

const externalWrdApiService = new ExternalWordApiServiceMock();

describe('The lexic MicroService', () => {
    it('should be created', (done) => {
        const CONSTRUCTOR = () => new Lexic(DB_PROVIDER, RX_BUILDER, externalWrdApiService);
        expect(CONSTRUCTOR).to.not.throw();
        done();
    });

    let lexic: Lexic;
    beforeEach(() => {
        lexic = new Lexic(DB_PROVIDER, RX_BUILDER, externalWrdApiService);
    });

    describe('has a Filter that', () => {
        const CONSTRAINTS: [WordConstraint, RegExp][] = [[{
            charConstraints: [{ char: 'b', position: 1 }, { char: 'a', position: 0 }],
            isCommon: true,
            minLength: 5
        }, (/^ab.{3}$/i)], [{
            charConstraints: [{ char: '1', position: 1 }, { char: 'a', position: 0 }],
            isCommon: true,
            minLength: 5
        }, null], [{
            charConstraints: [{ char: 'b', position: -1 }, { char: 'a', position: 0 }],
            isCommon: true,
            minLength: 5
        }, null], [{
            charConstraints: [{ char: 'b', position: 1 }, { char: 'a', position: 0 }],
            isCommon: true,
            minLength: -1
        }, null], [{
            charConstraints: [{ char: 'b', position: 1 }, { char: 'a', position: 1 }],
            isCommon: true,
            minLength: -1
        }, null]];

        it('should give a list of words that correspond to valid constraints', (done) => {
            const PROMISES: Promise<any>[] = [];
            for (let i = 0; i < CONSTRAINTS.length; i++) {
                PROMISES.push(lexic.getWords(CONSTRAINTS[i][0]).then((words: string[]) => {
                    expect(words).to.be.an.instanceOf(Array);
                    if (CONSTRAINTS[i][1] === null) {
                        expect(words.length).to.equal(0);
                    } else {
                        expect(words.length).to.be.greaterThan(0);
                    }
                    words.forEach((word: string) => {
                        expect(word).to.match(CONSTRAINTS[i][1]);
                    });
                }, (error) => {
                    expect(CONSTRAINTS[i][1]).to.be.null;
                }));
            }
            Promise.all(PROMISES).then(() => done()).catch((error) => done(error));
        });
    });

    it('should be able to tell if there exists a word for a given constraint', (done) => {
        const PROMISES = [];

        const NON_EXISTING_CONSTRAINT = {
            minLength: 4, isCommon: true, charConstraints: [
                { char: 'a', position: 0 },
                { char: 'b', position: 1 },
                { char: 'b', position: 2 },
                { char: 'c', position: 3 }
            ]
        } as WordConstraint;
        PROMISES.push(
            lexic.hasWord(NON_EXISTING_CONSTRAINT).then((hasWord) => {
                expect(hasWord).to.be.false;
            })
        );

        const EXISTING_CONSTRAINT = {
            minLength: 4, charConstraints: [
                { char: 'a', position: 0 },
                { char: 'b', position: 1 },
                { char: 'b', position: 2 }
            ]
        } as WordConstraint;
        PROMISES.push(
            lexic.hasWord(EXISTING_CONSTRAINT).then((hasWord) => {
                expect(hasWord).to.be.true;
            })
        );

        Promise.all(PROMISES).then(done.call(null), done);
    });

    it('should fetch the definitions of a given word', (done) => {
        lexic.getDefinitions('banana').then((definitions: string[]) => {
            expect(definitions).to.contain('fruit').and.to.contain('boomrang-like object');
            done();
        }).catch(done);
    });
});
