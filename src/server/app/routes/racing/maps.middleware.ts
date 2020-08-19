import * as express from 'express';

import { MiddleWare, Route } from '../middle-ware';
import { HttpStatus, getStatusOrDefault } from '../../../../common/src';
import { provideDatabase } from '../../app-db';
import { MapDbService } from './map-db-service';
import { SerializedMap } from '../../../../common/src/racing/serialized-map';
import { MapUpdater } from './map-updater';
import { SerializedBestTime } from '../../../../common/src/racing/serialized-best-time';
import { SerializedPlayer } from '../../../../common/src/racing/serialized-player';

@MiddleWare('/racing/maps')
export class MapsMiddleWare {

    private static readonly MAP_DB_SERVICE: MapDbService =
        new MapDbService(provideDatabase());

    @Route('get', '/:name')
    public getMaps(req: express.Request,
                   res: express.Response): void {
        MapsMiddleWare.MAP_DB_SERVICE.getByName(req.params.name)
            .then((serializedMap: SerializedMap) => {
                res.status(HttpStatus.OK);
                res.json(serializedMap);
            })
            .catch((reason: any) => {
                res.sendStatus(getStatusOrDefault(reason));
            });
    }

    @Route('post', '/')
    public postMaps(req: express.Request,
                    res: express.Response): void {
        const SERIALIZED_MAP: SerializedMap = req.body;
        MapsMiddleWare.MAP_DB_SERVICE.saveNew(SERIALIZED_MAP)
            .then(() => {
                res.sendStatus(HttpStatus.CREATED);
            })
            .catch((reason: any) => {
                res.sendStatus(getStatusOrDefault(reason));
            });
    }

    @Route('put', '/')
    public putMaps(req: express.Request,
                   res: express.Response): void {
        MapsMiddleWare.MAP_DB_SERVICE.saveEdited(req.body)
            .then(() => {
                res.sendStatus(HttpStatus.OK);
            })
            .catch((reason: any) => {
                res.sendStatus(getStatusOrDefault(reason));
            });
    }

    @Route('delete', '/:name')
    public deleteMaps(req: express.Request,
                      res: express.Response): void {
        MapsMiddleWare.MAP_DB_SERVICE.delete(req.params.name)
            .then(() => {
                res.sendStatus(HttpStatus.OK);
            })
            .catch((reason: any) => {
                res.sendStatus(getStatusOrDefault(reason));
            });
    }

    @Route('get', '/:name/best-times')
    public getMapBestTimes(req: express.Request,
                            res: express.Response): void {
        MapsMiddleWare.MAP_DB_SERVICE.getMapProperties(req.params.name, {_id: false, bestTimes: true})
        .then(mapFields => {
            const bestTimes: number[] = mapFields['bestTimes'];
            res.statusCode = HttpStatus.OK;
            res.json(bestTimes);
        })
        .catch((reason: any) => {
            res.sendStatus(getStatusOrDefault(reason));
        });
    }

    @Route('patch', '/:name/increment-plays')
    public incrementMapNumberOfPlays(req: express.Request,
                                     res: express.Response): void {
        MapUpdater.getInstance()
            .incrementPlays(req.params.name)
            .then(() => {
                res.status(HttpStatus.OK);
                res.json({});
            })
            .catch((reason: any) => res.sendStatus(getStatusOrDefault(reason)));
    }

    @Route('patch', '/:name/best-times/player/:player/time/:time')
    public updateMapBestTime(req: express.Request,
                             res: express.Response): void {
        const bestTime = new SerializedBestTime(new SerializedPlayer(req.params.player), Number(req.params.time));
        MapUpdater.getInstance()
            .updateTime(req.params.name, bestTime)
            .then(() => {
                res.status(HttpStatus.OK);
                res.json({});
            })
            .catch((reason: any) => res.sendStatus(getStatusOrDefault(reason)));
    }

    @Route('patch', '/:name/rating/:rating')
    public updateMapRating(req: express.Request,
                           res: express.Response): void {
        MapUpdater.getInstance()
            .updateRating(req.params.name, Math.round(Number(req.params.rating)))
            .then(() => {
                res.status(HttpStatus.OK);
                res.json({});
            })
            .catch((reason: any) => res.sendStatus(getStatusOrDefault(reason)));
    }

}
