import * as http from 'http';
import { CharConstraint, HttpStatus } from '../../../../../common/src';

// This class gets words from the Lexical microservice.

export class LexiconCaller {

    private static readonly INSTANCE = new LexiconCaller();
    private static readonly BASE_URL = 'http://localhost:3000/crossword/lexic';

    private constructor() {}

    public static getInstance(): LexiconCaller {
        return LexiconCaller.INSTANCE;
    }

    public getWords(minLength: number,
                    maxLength: number = 100,
                    isCommon: boolean = true,
                    charConstraints: CharConstraint[] = []): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const URL = LexiconCaller.BASE_URL + '/words?' +
                        'minLength='  + minLength +
                        '&maxLength=' + maxLength +
                        '&isCommon='  + isCommon  +
                        '&charConstraints=' + JSON.stringify(charConstraints);
            http.get(URL, (response: http.IncomingMessage) => {
                let data = '';
                response.on('data', (chunk) => data += chunk);
                response.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (e) {
                        reject();
                    }
                });
                response.on('error', reject);
            }).setTimeout(0).end();
        });
    }

    public doWordsExist(minLength: number,
                        maxLength: number = 100,
                        isCommon: boolean = true,
                        charConstraints: CharConstraint[] = []): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const url = LexiconCaller.BASE_URL + '/words/check?' +
                        'minLength='  + minLength +
                        '&maxLength=' + maxLength +
                        '&isCommon='  + isCommon  +
                        '&charConstraints=' + JSON.stringify(charConstraints);
            http.get(url, (response: http.IncomingMessage) => {
                response.on('error', reject);
                const STATUS_CODE: HttpStatus = response.statusCode;
                switch (STATUS_CODE) {
                    case HttpStatus.OK: resolve(true); break;
                    case HttpStatus.NOT_FOUND: resolve(false); break;
                    default: reject('Unexected http status code: ' + STATUS_CODE); break;
                }
            }).setTimeout(0).end();
        });
    }

    public getDefinitions(word: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            const url = LexiconCaller.BASE_URL + '/definitions/' + word;
            http.get(url, (response: http.IncomingMessage) => {
                let data = '';
                response.on('data', (chunk) => data += chunk);
                response.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (e) {
                        reject();
                    }
                });
                response.on('error', reject);
            }).setTimeout(0).end();
        });
    }
}
