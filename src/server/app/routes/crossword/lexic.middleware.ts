import * as express from 'express';

import { Route, MiddleWare } from '../middle-ware';
import { HttpStatus } from '../../../../common/src';
import { WordConstraint, isWordConstraint, parseWordConstraint } from '../../../../common/src/lexic/word-constraint';
import { provideDatabase } from '../../app-db';
import { isJson } from '../../../../common/src/utils';
import { CharConstraint } from '../../../../common/src/lexic/char-constraint';
import { RegexBuilder } from './lexic/regex-builder';
import { Lexic } from './lexic';
import { ExternalWordApiService } from './lexic/external-word-api.service';
import { Logger } from '../../../../common/src/logger';


@MiddleWare('/crossword/lexic')
export class LexicMiddleWare {
    private static readonly logger = Logger.getLogger('Lexic');
    private static readonly LEXIC = new Lexic(provideDatabase(), new RegexBuilder(), new ExternalWordApiService());

    private static parseQuery(query: any): WordConstraint {
        let minLength: number = query.minLength,
            maxLength: number = null,
            isCommon,
            charConstraints: CharConstraint[] = [];
        if ('minLength' in query) {
            minLength = Number(query.minLength);
        }
        if ('isCommon' in query) {
            isCommon = typeof query.isCommon === 'string' ? query.isCommon === 'true' : Boolean(query.isCommon);
        }
        if ('charConstraints' in query) {
            if (typeof query.charConstraints === 'string' && isJson(query.charConstraints)) {
                charConstraints = JSON.parse(query.charConstraints);
            } else if (Array.isArray(query.charConstraints)) {
                charConstraints = query.charConstraints;
            }
        }
        if ('maxLength' in query) {
            maxLength = Number(query.maxLength);
        } else {
            maxLength = minLength;
        }
        return <WordConstraint>{ minLength, maxLength, isCommon, charConstraints };
    }

    private static catchAndSendStatus(promise: Promise<any>, res: express.Response) {
        promise.catch((status: HttpStatus) => res.sendStatus(status)).catch((error: Error) => {
            LexicMiddleWare.logger.warn(error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            res.send(error.message);
        }).catch((reason: any) => {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR);
            res.send(reason);
        });
    }

    @Route('get', '/words/:checkExistance?')
    public words(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let initialQuery;
        initialQuery = LexicMiddleWare.parseQuery(req.query);
        if (isWordConstraint(initialQuery)) {
            const CONSTRAINT: WordConstraint = parseWordConstraint(initialQuery);
            if (req.params.checkExistance === 'check') {
                const PROMISE = LexicMiddleWare.LEXIC.hasWord(CONSTRAINT)
                    .then((hasWord: boolean) => res.sendStatus(hasWord ? HttpStatus.OK : HttpStatus.NOT_FOUND));
                LexicMiddleWare.catchAndSendStatus(PROMISE, res);
            }
            else {
                const PROMISE = LexicMiddleWare.LEXIC.getWords(CONSTRAINT).then((words) => res.json(words));
                LexicMiddleWare.catchAndSendStatus(PROMISE, res);
            }
        } else {
            res.status(HttpStatus.BAD_REQUEST);
            res.json(new Error('Bad query string: ' + req.query));
        }
    }

    @Route('get', '/definitions/:word')
    public definitions(req: express.Request, res: express.Response, next: express.NextFunction): void {
        if (!('word' in req.params) || !req.params.word) {
            res.sendStatus(HttpStatus.BAD_REQUEST);
        }
        const PROMISE = LexicMiddleWare.LEXIC.getDefinitions(req.params.word)
            .then((definitions: string[]) => res.json(definitions));
        LexicMiddleWare.catchAndSendStatus(PROMISE, res);
    }
}
