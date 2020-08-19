import { Injectable } from '@angular/core';

import { RacingRenderer } from './rendering/racing-renderer';
import { PhysicEngine } from './physic/engine';
import { RenderableMap } from './racing-game-map/renderable-map';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import { UIInputs } from '../services/ui-input.service';
import { Car } from './models/car/car';
import { EventManager } from '../../event-manager.service';
import { MapService } from '../services/map.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { SoundService } from '../services/sound-service';
import { Sound } from './sound/sound';
import { CarsService } from './cars.service';
import { CarsProgressionService, CAR_LAP_UPDATE_EVENT } from './cars-progression.service';
import { GameInfoService } from './game-info.service';
import { Seconds } from '../../types';
import { GAME_START_EVENT, GAME_COMPLETED_EVENT, KEYDOWN_EVENT, CAR_COMPLETED_RACE } from '../constants';
import { LapUpdateInfo } from './lap-update-info';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class RacingGameService {
    public static readonly DEFAULT_CONTROLLABLE_CAR_IDX = 2;
    public static readonly COUNTDOWN_DURATION: Seconds = 3.2;

    public readonly renderer: RacingRenderer;
    public readonly waitToLoad: Promise<void>;
    public readonly waitToFinalize: Observable<void>;
    public startTime: Seconds = Date.now() / 1000;

    private readonly finalizeSubject = new Subject<void>();

    private map: RenderableMap;
    private userInputs: UIInputs = null;
    private initialSubscription: Subscription;

    public get lap(): number {
        console.log('game service is fetching lap value, which is : ' + this.gameInfoService.maxLap);
        return this.gameInfoService.maxLap;
    }

    constructor(private physicEngine: PhysicEngine,
        private mapService: MapService,
        private eventManager: EventManager,
        private soundService: SoundService,
        private carsService: CarsService,
        private carsProgressionService: CarsProgressionService,
        private gameInfoService: GameInfoService) {

        this.waitToLoad = Promise.all([
            this.carsService.waitToLoad,
            this.soundService.waitToLoad
        ]).then(() => { });
        this.waitToFinalize = this.finalizeSubject.asObservable();
        this.renderer = new RacingRenderer(eventManager, this.gameInfoService);
        eventManager.registerClass(this);
    }

    public initialize(container: HTMLDivElement, hudCanvas: HTMLCanvasElement, userInputs: UIInputs): void {
        this.renderer.initialize(container, hudCanvas);
        this.soundService.initialize(this.renderer.getBothCameras()[0]);
        this.userInputs = userInputs;

        const userCar = this.carsService.getPlayerCar();
        this.renderer.setCamerasTarget(userCar);

        this.carsService.initialize(this.soundService, userInputs, this.map);

        this.renderer.updateDayMode(RacingRenderer.DEFAULT_DAYMODE);

        // If the game is stopping before it was loaded, then don't start anything.
        const finalizePromise = new Promise<void>((resolve, reject) => {
            this.initialSubscription = this.waitToFinalize.subscribe(resolve, reject, resolve);
        }).then(() => Promise.reject('Initialization canceled'));
        Promise.race([
            finalizePromise,
            this.waitToLoad
        ]).then(() => {
            this.renderer.startRendering();
            return Promise.race([
                finalizePromise,
                this.soundService.setAmbiantSound(Sound.START_SOUND)
            ]);
        }).then(() => {
            this.gameInfoService.startTimer(RacingGameService.COUNTDOWN_DURATION);
            Promise.race([finalizePromise, this.soundService.playAmbiantSound(false)])
                .then(() => Promise.race([finalizePromise, this.soundService.setAmbiantSound(Sound.TETRIS)]))
                .then(() => this.soundService.playAmbiantSound(true))
                .catch(() => { });
            return Promise.race([
                finalizePromise,
                new Promise((resolve) => setTimeout(resolve, RacingGameService.COUNTDOWN_DURATION * 1000))
            ]);
        }).then(() => {
            this.physicEngine.start();
            const event: EventManager.Event<void> = { name: GAME_START_EVENT, data: void 0 };
            this.eventManager.fireEvent(event.name, event);
            this.carsService.startControllers();
        }).catch(() => { });
    }

    public finalize() {
        this.finalizeSubject.next();

        this.physicEngine.stop();
        this.renderer.stopRendering();

        this.carsService.finalize();
        this.userInputs = null;

        this.soundService.finalize();
        this.physicEngine.finalize();
        this.renderer.finalize();
        this.initialSubscription.unsubscribe();
    }

    public loadMap(mapName: string): Promise<void> {
        return this.mapService.getByName(mapName)
            .then(map => this.setMap(map));
    }

    private setMap(map: SerializedMap): Promise<void> {
        if (this.map) {
            this.carsService.removeFromMap(this.map);
            this.renderer.removeMap(this.map);
        }

        this.map = new RenderableMap(map, this.eventManager);
        this.physicEngine.initialize(this.map);
        this.renderer.addMap(this.map);

        this.carsService.addToMap(this.map);
        return this.map.waitToLoad.then(() => { });
    }

    public updateRendererSize(width: number, height: number) {
        this.renderer.updateSize(width, height);
    }

    public toggleDayMode(): void {
        this.renderer.toggleDayMode();
    }

    public get mapName(): string {
        return this.map.mapName;
    }

    @EventManager.Listener(KEYDOWN_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private changeMaxLap(event: EventManager.Event<KeyboardEvent>) {
        // keys from '1' to '9'
        const MIN = 1, MAX = 9;
        const keysArray = new Array(MIN + MAX - 1).fill(0).map((dummy, index) => (index + MIN).toString());
        const keys = new Set(keysArray);

        if (this.userInputs && keys.has(event.data.key) && this.userInputs.isKeyPressed(event.data.key)) {
            this.gameInfoService.maxLap = +event.data.key;
        }
    }

    @EventManager.Listener(CAR_LAP_UPDATE_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private handleCarCompletedRace(event: EventManager.Event<LapUpdateInfo>) {
        if (event.data.lap > this.gameInfoService.maxLap) {
            this.carsProgressionService.carPositionTrackingState.set(event.data.car, false);
            this.eventManager.fireEvent(CAR_COMPLETED_RACE, {
                name: CAR_COMPLETED_RACE,
                data: event.data.car
            });
            if (event.data.isUser) {
                this.eventManager.fireEvent(GAME_COMPLETED_EVENT, {
                    name: GAME_COMPLETED_EVENT,
                    data: void 0
                });
            }
        }
    }
}
