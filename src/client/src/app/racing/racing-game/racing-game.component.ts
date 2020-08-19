import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { trigger, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/toPromise';

import { RacingGameService } from './racing-game.service';
import { UIInputs } from '../services/ui-input.service';

import { EventManager } from '../../event-manager.service';
import { KEYDOWN_EVENT, GAME_COMPLETED_EVENT } from '../constants';
import { EndViewService } from '../services/end-view.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-racing-game',
    templateUrl: './racing-game.component.html',
    styleUrls: ['./racing-game.component.css'],
    animations: [
        trigger('gameLoaded', [
            transition('* => void', animate(1000, style({ opacity: 0 })))
        ])
    ]
})
export class RacingGameComponent implements OnInit, OnDestroy {
    public static readonly HEADER_HEIGHT = 50;
    public static readonly MAP_NAME_URL_PARAMETER = 'map-name';
    private static readonly ZOOM_FACTOR = 1.025;
    private static readonly COLOR_FILTERS = ['normal', 'protanopia', 'protanomaly', 'deuteranopia',
        'deuteranomaly', 'tritanopia', 'tritanomaly', 'achromatopsia', 'achromatomaly'];

    public gameLoaded = false;
    public colorFilterClass = RacingGameComponent.COLOR_FILTERS[0];

    @ViewChild('gameContainer')
    public racingGameContainer: ElementRef;
    @ViewChild('hud')
    private hudCanvas: ElementRef;
    @ViewChild('userInputs')
    private uiInputs: UIInputs;
    private routeSubscription: Subscription;
    private endGameState;

    constructor(private racingGame: RacingGameService,
        private route: ActivatedRoute,
        private eventManager: EventManager,
        private endViewService: EndViewService) {
        this.eventManager.registerClass(this);
    }

    public ngOnInit(): void {
        this.routeSubscription = this.route.paramMap.switchMap((params: ParamMap) =>
            [params.get(RacingGameComponent.MAP_NAME_URL_PARAMETER)]).subscribe(mapName => {
                this.racingGame.loadMap(mapName).then(() => {
                    this.racingGame.waitToLoad.then(() => this.gameLoaded = true);
                    this.racingGame.initialize(this.racingGameContainer.nativeElement, this.hudCanvas.nativeElement, this.uiInputs);
                    this.updateRendererSize();
                });
            });
        this.racingGame.waitToLoad.then(() => this.gameLoaded = true);
        this.endGameState = false;
    }

    public ngOnDestroy() {
        this.gameLoaded = false;
        this.racingGame.finalize();
        this.routeSubscription.unsubscribe();
    }

    @HostListener('window:resize', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private updateRendererSize() {
        const height = window.innerHeight - RacingGameComponent.HEADER_HEIGHT;
        const width = window.innerWidth;

        this.racingGame.updateRendererSize(width, height);
    }

    @EventManager.Listener(KEYDOWN_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private onKeyDown() {
        if (!this.endGameState) {
            if (this.uiInputs.isKeyPressed('c')) {
                this.racingGame.renderer.currentCamera = (1 - this.racingGame.renderer.currentCamera) as 0 | 1;
            }

            if (this.uiInputs.isKeyPressed('n')) {
                this.racingGame.toggleDayMode();
            }

            if (this.uiInputs.isKeyPressed('+') || this.uiInputs.isKeyPressed('=')) {
                const currentCamera = this.racingGame.renderer.currentCamera;
                this.racingGame.renderer.getBothCameras()[currentCamera].zoom *= RacingGameComponent.ZOOM_FACTOR;
                this.racingGame.renderer.getBothCameras()[currentCamera].updateProjectionMatrix();
            }

            if (this.uiInputs.isKeyPressed('-') || this.uiInputs.isKeyPressed('_')) {
                const currentCamera = this.racingGame.renderer.currentCamera;
                this.racingGame.renderer.getBothCameras()[currentCamera].zoom /= RacingGameComponent.ZOOM_FACTOR;
                this.racingGame.renderer.getBothCameras()[currentCamera].updateProjectionMatrix();
            }

            if (this.uiInputs.isKeyPressed('r')) {
                this.racingGame.renderer.toggleRearViewCamera();
            }

            if (this.uiInputs.isKeyPressed('f')) {
                const indexOfFilter = this.toggleNextColorFilter();
                this.colorFilterClass = RacingGameComponent.COLOR_FILTERS[indexOfFilter];
            }

            if (this.uiInputs.isKeyPressed('x')) {
                this.displayable();
            }

            const areAllowedKeyCombinationsPressed =
                this.uiInputs.areKeysPressed('control', 'shift', 'i') ||
                this.uiInputs.isKeyPressed('f5');

            if (!areAllowedKeyCombinationsPressed) {
                return false; // Prevent Default behaviors
            }
        }
    }

    private displayable(): void {
        this.endViewService.initializationForNewMap();
    }

    private toggleNextColorFilter(): number {
        const currentFilterIndex = RacingGameComponent.COLOR_FILTERS
            .findIndex((filter) => this.colorFilterClass === filter);
        return (currentFilterIndex + 1) % RacingGameComponent.COLOR_FILTERS.length;
    }

    @HostListener('window:contextmenu', ['$event'])
    // tslint:disable-next-line:no-unused-variable
    private preventEvent(event: Event) {
        return false; // Prevent Default behaviors
    }

    @EventManager.Listener(GAME_COMPLETED_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private displayEndGameMenu(event: EventManager.Event<void>) {
        this.endViewService.initializationForNewMap();
        this.endViewService.incrementMapNumberOfPlays();
        this.endGameState = true;
    }
}
