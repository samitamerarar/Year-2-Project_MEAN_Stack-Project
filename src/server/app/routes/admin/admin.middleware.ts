import * as express from 'express';
import * as cors from 'cors';

import { MiddleWare, Route } from '../middle-ware';
import { AdminDbService } from './admin-db.service';
import { Logger } from '../../../../common/src/logger';
import { HttpStatus, warn } from '../../../../common/src';

const logger = Logger.getLogger('Admin');

@MiddleWare('/admin', cors({
    credentials: true,
    origin: (origin, callback) => callback(null, true),
    optionsSuccessStatus: HttpStatus.NO_CONTENT,
    methods: ['POST', 'GET', 'PATCH']
}))
export class AdminMiddleWare {
    @Route('get', '/authentication')
    public checkLogin(req: express.Request, res: express.Response) {
        if (req.session.isConnected) {
            res.sendStatus(HttpStatus.OK);
        }
        else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Login route
     */
    @Route('post', '/authentication')
    public login(req: express.Request, res: express.Response) {
        const PASSWORD: string = ('password' in req.body && req.body.password) || '';
        logger.debug('Password "%s"', PASSWORD, req.body);
        AdminDbService.getInstance().checkPassword(PASSWORD).then((ok) => {
            if (ok) {
                req.session.isConnected = true;
                res.sendStatus(HttpStatus.OK);
            }
            else {
                req.session.isConnected = false;
                res.sendStatus(HttpStatus.UNAUTHORIZED);
            }
        }).catch((reason) => {
            req.session.isConnected = false;
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        });
    }

    @Route('patch', '/authentication/password')
    public changePassword(req: express.Request, res: express.Response) {
        if (req.session.isConnected) {
            if ('password' in req.body && 'confirmation' in req.body &&
                req.body.password === req.body.confirmation) {
                AdminDbService.getInstance().changePassword(req.body.password)
                .then((updated: boolean) => {
                    if (updated) {
                        res.sendStatus(HttpStatus.ACCEPTED);
                    }
                    else {
                        res.sendStatus(HttpStatus.NOT_MODIFIED);
                    }
                }).catch(warn(logger))
                .catch((status: HttpStatus) => res.sendStatus(status))
                .catch(() => res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR));
            }
        }
        else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    }
}
