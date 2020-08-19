import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import { Map } from '../../admin-screen/map-editor/map';
import { SerializedPothole } from '../../../../../common/src/racing/serialized-pothole';
import { SerializedPuddle } from '../../../../../common/src/racing/serialized-puddle';
import { SerializedSpeedBoost } from '../../../../../common/src/racing/serialized-speed-boost';
import { Point } from '../../../../../common/src/math/index';

@Injectable()
export class MapService {

    private static readonly HEADERS: RequestOptionsArgs =
        {headers: new Headers({'Content-Type': 'application/json'})};

    public maps: Map[];

    constructor(private http: Http) {
    }

    public saveNew(serializedMap: SerializedMap): Promise<void> {
        const url = 'http://localhost:3000/racing/maps';
        return this.http.post(url, JSON.stringify(serializedMap), MapService.HEADERS).toPromise().then(() => null);
    }

    public saveEdited(serializedMap: SerializedMap): Promise<void> {
        const url = 'http://localhost:3000/racing/maps/';
        return this.http.put(url, JSON.stringify(serializedMap), MapService.HEADERS).toPromise().then(() => null);
    }

    public delete(name: string): Promise<void> {
        const url = 'http://localhost:3000/racing/maps/' + name;
        return this.http.delete(url).toPromise().then(() => null);
    }

    public getMapNames(count: number): Promise<string[]> {
        const url = 'http://localhost:3000/racing/map-names/' + count;
        return this.http.get(url).toPromise().then(response => response.json() as string[]);
    }

    public getByName(name: string): Promise<SerializedMap> {
        const url = 'http://localhost:3000/racing/maps/' + name;
        return this.http.get(url).toPromise().then(response => {
            const json = response.json();
            return new SerializedMap(json.name,
                                     json.description,
                                     json.type,
                                     json.sumRatings,
                                     json.numberOfRatings,
                                     json.numberOfPlays,
                                     json.points.map(point => new Point(point.x, point.y)),
                                     json.potholes.map(pothole => new SerializedPothole(pothole.position)),
                                     json.puddles.map(puddle => new SerializedPuddle(puddle.position)),
                                     json.speedBoosts.map(speedBoost => new SerializedSpeedBoost(speedBoost.position)),
                                     json.bestTimes);
        });
    }

}
