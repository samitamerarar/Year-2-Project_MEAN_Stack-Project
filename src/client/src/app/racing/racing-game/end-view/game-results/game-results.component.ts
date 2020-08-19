import { Component } from '@angular/core';
import { EndViewService, EndGameWindow } from '../../../services/end-view.service';
import { GameInfoService } from '../../game-info.service';
import { Car } from '../../models/car/car';
import { Seconds } from '../../../../types';
import { CarsProgressionService } from '../../cars-progression.service';

@Component({
    selector: 'app-game-results',
    templateUrl: './game-results.component.html',
    styleUrls: ['./game-results.component.css']
})
export class GameResultsComponent {

    private static readonly NUMBER_OF_STARS = 5;
    private static readonly FILLED_STAR_URL = '/assets/racing/stars-rating/filled-star.png';
    private static readonly EMPTY_STAR_URL = '/assets/racing/stars-rating/empty-star.png';
    public stars: string[] = [];
    public indexOfStarClicked;
    public laps: [Car, Seconds[], Seconds][];
    public sortedCarsTime: [Car, Seconds][];

    constructor(
        private endViewService: EndViewService,
        private gameInfoService: GameInfoService,
        private carProgressionService: CarsProgressionService) {
        for (let i = 0; i < GameResultsComponent.NUMBER_OF_STARS; i++) {
            this.stars.push(GameResultsComponent.EMPTY_STAR_URL);
        }
        this.orderLapTimesTable();
        this.setUserTimeIfFinishFirst();
    }
    public get timeTable(): Map<Car, number[]> {
        return this.gameInfoService.lapTimesTable;
    }

    public mouseHoverStar(indexOfStar: number): void {
        this.stars.fill(GameResultsComponent.EMPTY_STAR_URL);
        for (let i = 0; i <= indexOfStar; i++) {
            this.stars[i] = GameResultsComponent.FILLED_STAR_URL;
        }
    }

    public mouseOutOfStar(): void {
        this.stars.fill(GameResultsComponent.EMPTY_STAR_URL);
        if (this.indexOfStarClicked >= 0 && this.indexOfStarClicked !== null) {
            for (let i = 0; i <= this.indexOfStarClicked; i++) {
                this.stars[i] = GameResultsComponent.FILLED_STAR_URL;
            }
        }
    }

    public clickOnStar(indexOfStar: number): void {
        this.indexOfStarClicked = indexOfStar;
    }

    public displayBestTimeComponent(): void {
        if (this.indexOfStarClicked + 1) {
            this.endViewService.updateMapRating(this.indexOfStarClicked + 1);
        }
        this.endViewService.displayGameResult = EndGameWindow.BEST_TIME;
        this.endViewService.setMapBestTimes();
    }

    public orderLapTimesTable(): void {
        let lapTimesTable = Array.from(this.gameInfoService.lapTimesTable.entries());
        lapTimesTable = lapTimesTable.map(([car, lapTimes], index, array) => {
            let carTime = lapTimes[lapTimes.length - 1] - lapTimes[0];
            if (lapTimes.length - 1 < this.gameInfoService.maxLap) {
                carTime = this.getApproximatedTimeForCar(car);
                const missingTime = carTime - lapTimes[lapTimes.length - 1] + lapTimes[0];
                const missingLaps = this.gameInfoService.maxLap - (lapTimes.length - 1);
                for (let i = 0; i < missingLaps; ++i) {
                    lapTimes.push(lapTimes[lapTimes.length - 1] + (i + 1) * (missingTime / missingLaps));
                }
            }
            return [car, lapTimes] as [Car, Seconds[]];
        });
        const carsTimes = lapTimesTable.map(([car, lapTimes]: [Car, Seconds[]]) => {
            const carTime = lapTimes[lapTimes.length - 1] - lapTimes[0];
            return [car, carTime] as [Car, Seconds];
        });
        const sortedCarsTimes = carsTimes.sort(([car1, time1], [car2, time2]) => {
            return time1 - time2;
        });
        this.sortOrderedLapTimesTable(sortedCarsTimes);
    }

    public sortOrderedLapTimesTable(sortedCarsTimes: any): void {
        this.sortedCarsTime = sortedCarsTimes;
        this.endViewService.userIsFirstPlace = this.sortedCarsTime[0][0] === this.gameInfoService.controlledCar;
        this.laps = sortedCarsTimes.map(([car, time]) =>
            [car, this.gameInfoService.lapTimesTable.get(car), time] as [Car, Seconds[], Seconds])
            .map(([car, lapTimes, time]) => {
                const startingTime = lapTimes[0];
                lapTimes.forEach((lapTime: Seconds, index) => {
                    lapTimes[index] -= startingTime;
                    lapTimes[index] = Math.round(lapTimes[index] * 100) / 100;
                });
                lapTimes.shift();
                time = Math.round(time * 100) / 100;
                return [car, lapTimes, time] as [Car, Seconds[], Seconds];
            });
    }

    public getApproximatedTimeForCar(car: Car): Seconds {
        const carCompletion = this.carProgressionService.getCarCompletion(car) - 1;
        const expectedCompletion = this.gameInfoService.maxLap;
        const completionTime = Date.now() / 1000 - this.gameInfoService.lapTimesTable.get(car)[0];
        const expectedCompletionTime = expectedCompletion * completionTime / carCompletion;
        return expectedCompletionTime;
    }

    public setUserTimeIfFinishFirst(): void {
        this.endViewService.userTime = this.laps[0][2];
    }

}
