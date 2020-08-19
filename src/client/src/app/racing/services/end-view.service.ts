import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http/src/response';
import { SerializedBestTime } from '../../../../../common/src/racing/serialized-best-time';
import { RacingGameService } from '../racing-game/racing-game.service';
import { CarsProgressionService } from '../racing-game/cars-progression.service';


export enum EndGameWindow {
    NONE,
    MAP_RATING,
    BEST_TIME
}

interface RequestOptions {
    observe: 'response';
    withCredentials: boolean;
    responseType: 'json';
}

@Injectable()
export class EndViewService {

    private static readonly MAX_NUMBER_BEST_TIMES = 5;
    private static readonly REQUEST_OPTIONS: RequestOptions = {
        observe: 'response',
        withCredentials: false,
        responseType: 'json'
    };

    private static readonly MAP_SERVER_PATH = 'http://localhost:3000/racing/maps/';

    public displayGameResult: EndGameWindow = EndGameWindow.NONE;
    public mapName = '';
    public mapBestTimes: SerializedBestTime[] = [];
    public isInMapBestTimes = false;
    public userTime;
    public userIsFirstPlace = false;

    constructor(
        private http: HttpClient,
        private racingGameService: RacingGameService,
        private carProgressionService: CarsProgressionService) { }

    public reset(): void {
        this.displayGameResult = EndGameWindow.NONE;
        this.userIsFirstPlace = false;
        this.isInMapBestTimes = false;
        this.userTime = 0;
    }

    public initializationForNewMap(): void {
        this.mapName = this.racingGameService.mapName;
        this.displayGameResult = EndGameWindow.MAP_RATING;
    }

    public updateMapRating(rating: number): void {
        const URL = EndViewService.MAP_SERVER_PATH + this.mapName + '/rating/' + rating;
        this.http.patch(URL, EndViewService.REQUEST_OPTIONS).toPromise();
    }

    public getMapBestTimes(): Promise<HttpResponse<Object>> {
        const URL = EndViewService.MAP_SERVER_PATH + this.mapName + '/best-times';
        return this.http.get(URL, EndViewService.REQUEST_OPTIONS).toPromise();
    }

    public setMapBestTimes(): Promise<void> {
        this.mapBestTimes = [];
        return this.getMapBestTimes().then(response => {
            const tempArray: SerializedBestTime[] = (response.body) as SerializedBestTime[];
            tempArray.forEach((bestTime) => {
                this.mapBestTimes.push(bestTime);
            });
        });
    }

    public updateMapBestTime(userName: string): Promise<void> {
        const URL = EndViewService.MAP_SERVER_PATH + this.mapName + '/best-times/player/' + userName
        + '/time/' + this.userTime;
        return this.http.patch(URL, EndViewService.REQUEST_OPTIONS).toPromise().then(() => {});
    }

    public userIsInMapBestTimes(): Boolean {
        if (this.checkIfUserIsFirstPlace()) {
            if (this.mapBestTimes.length === EndViewService.MAX_NUMBER_BEST_TIMES) {
                this.mapBestTimes.sort();
                return this.userTime < this.mapBestTimes[this.mapBestTimes.length - 1].value;
            } else {
                return true;
            }
        }
        return false;
    }

    public incrementMapNumberOfPlays(): Promise<void> {
        const URL = EndViewService.MAP_SERVER_PATH + this.mapName + '/increment-plays';
        return this.http.patch(URL, EndViewService.REQUEST_OPTIONS).toPromise().then(() => {});
    }

    private checkIfUserIsFirstPlace(): boolean {
        return this.carProgressionService.computeUserRank() === 1;
    }
}
