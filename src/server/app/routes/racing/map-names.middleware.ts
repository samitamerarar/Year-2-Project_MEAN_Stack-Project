import * as express from 'express';

import { MiddleWare, Route } from '../middle-ware';
import { HttpStatus, getStatusOrDefault } from '../../../../common/src';
import { provideDatabase } from '../../app-db';
import { MapDbService } from './map-db-service';

@MiddleWare('/racing/map-names')
export class MapNamesMiddleWare {

    private static readonly MAP_DB_SERVICE: MapDbService =
        new MapDbService(provideDatabase());

    @Route('get', '/:count')
    public getMapNames(req: express.Request,
                       res: express.Response): void {
        const COUNT: number = req.params.count;
        MapNamesMiddleWare.MAP_DB_SERVICE.getMapNames(COUNT)
            .then((names: string[]) => {
                res.status(HttpStatus.OK);
                res.json(names);
            })
            .catch((reason: any) => {
                res.sendStatus(getStatusOrDefault(reason));
            });
    }

}
