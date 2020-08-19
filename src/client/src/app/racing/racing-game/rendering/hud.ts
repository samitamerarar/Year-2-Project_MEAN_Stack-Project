import * as THREE from 'three';
import { Seconds } from '../../../types';
import { GameInfoService } from '../game-info.service';

export interface Time {
    milliseconds: number;
    seconds: number;
    minutes: number;
    hours: number;
}

export class HUD {
    private static readonly FONT_FAMILLY = 'system-ui';
    private static readonly TEXT_COLOR = '#ffd700';

    private static readonly TEXT_HEIGTH = 0.05; // height (proportion of the screen height), normalized between 0 and 1
    private static readonly TEXT_OFFSET = 0.01;
    private static readonly HALF_SCREEN = 0.5;
    private static readonly INCREMENT = new THREE.Vector2(0, HUD.TEXT_HEIGTH + 2 * HUD.TEXT_OFFSET);
    private static readonly LAP_POSITION =
        new THREE.Vector2(HUD.TEXT_OFFSET, HUD.TEXT_HEIGTH + HUD.TEXT_OFFSET);
    private static readonly LAP_TIME_POSITION = HUD.LAP_POSITION.clone().add(HUD.INCREMENT);
    private static readonly GAME_TIME_POSITION = HUD.LAP_TIME_POSITION.clone().add(HUD.INCREMENT);
    private static readonly SPEED_POSITION = new THREE.Vector2(HUD.TEXT_OFFSET, 1 - (HUD.TEXT_OFFSET + HUD.TEXT_HEIGTH));
    private static readonly RACE_PLACE_POSITION =
        new THREE.Vector2(1 - HUD.TEXT_OFFSET, HUD.TEXT_HEIGTH + HUD.TEXT_OFFSET);
    private static readonly START_TIMER_POSITION = new THREE.Vector2(HUD.HALF_SCREEN, HUD.HALF_SCREEN);

    private context: CanvasRenderingContext2D = null;
    private domElementInternal: HTMLCanvasElement = null;
    public get domElement(): HTMLCanvasElement {
        return this.domElementInternal;
    }

    private static getFont(size: number): string {
        return `${size}px ${HUD.FONT_FAMILLY}`;
    }

    private static getFormatedNumber(n: number, minDigitCount: number): string {
        const BASE = 10;
        n = (n < 0) ? 0 : Math.floor(n);
        const nToString = n.toString(BASE);
        const digitCount = Math.max(Math.ceil(Math.log(n + 1) / Math.log(BASE)), 1);
        return '0'.repeat(Math.max(minDigitCount - digitCount, 0)) + nToString;
    }

    public initialize(canvas: HTMLCanvasElement): void {
        this.domElementInternal = canvas;
        this.context = this.domElement.getContext('2d', { alpha: true });
    }

    public finalize(): void {
        delete this.domElementInternal;
        delete this.context;
    }

    public setSize(width: number, height: number): void {
        if (this.domElementInternal != null) {
            this.domElementInternal.setAttribute('width', width.toString());
            this.domElementInternal.setAttribute('height', height.toString());
        }
    }

    public render(game: GameInfoService): void {
        const size = this.getSize(this.context);

        this.context.clearRect(0, 0, size.width, size.height);
        this.setupTextStyle();

        this.drawLapCount(this.context, game);
        this.drawLapTime(this.context, game);
        this.drawGameTime(this.context, game);
        this.drawRacePosition(this.context, game);
        this.drawSpeed(this.context, game);
        this.drawStartTimer(this.context, game);
    }

    private drawLapCount(context: CanvasRenderingContext2D, game: GameInfoService): void {
        const textPosition = this.getTextPosition(context, HUD.LAP_POSITION);

        if (game.userLapNumber < game.maxLap + 1) {
            this.context.fillText(`${game.userLapNumber}/${game.maxLap} laps     ${game.userLapCompletionInPercent}%`,
                textPosition.x, textPosition.y);
        }
        else {
            this.context.fillText(`Completed!`,
            textPosition.x, textPosition.y);
        }

    }

    private drawLapTime(context: CanvasRenderingContext2D, game: GameInfoService): void {
        const textPosition = this.getTextPosition(context, HUD.LAP_TIME_POSITION);

        const lapTime = this.getTime(Date.now() / 1000 - game.userLapTimes[game.userLapTimes.length - 1]);
        const currentTime = this.formatTime(lapTime);
        this.context.fillText(`Lap time: ${currentTime}`,
            textPosition.x, textPosition.y);
    }

    private drawGameTime(context: CanvasRenderingContext2D, game: GameInfoService): void {
        const textPosition = this.getTextPosition(context, HUD.GAME_TIME_POSITION);

        const gameTime = this.getTime(game.totalTime);
        const currentTime = this.formatTime(gameTime);
        this.context.fillText(`Time: ${currentTime}`,
            textPosition.x, textPosition.y);
    }

    private drawRacePosition(context: CanvasRenderingContext2D, game: GameInfoService): void {
        const textPosition = this.getTextPosition(context, HUD.RACE_PLACE_POSITION);

        const position: number = game.currentRank;

        const suffix = position > 3 ? 'th' : (position === 3 ? 'rd' : (position === 2 ? 'nd' : 'st'));

        const text = `${position}${suffix}`;
        const textWidth = this.context.measureText(text).width;
        this.context.fillText(text,
            textPosition.x - textWidth, textPosition.y);
    }

    private drawSpeed(context: CanvasRenderingContext2D, game: GameInfoService) {
        const textPosition = this.getTextPosition(context, HUD.SPEED_POSITION);

        const speed = game.controlledCar.front.dot(game.controlledCar.velocity);

        const text = `${speed.toFixed(2)} m/s`;
        this.context.fillText(text,
            textPosition.x, textPosition.y);
    }

    private drawStartTimer(context: CanvasRenderingContext2D, game: GameInfoService) {
        const textPosition = this.getTextPosition(context, HUD.START_TIMER_POSITION);
        const screenSize = this.getSize(context);

        const countDown = Math.ceil(game.startTime - Date.now() / 1000);
        const text = `${countDown > 0 ? countDown : (countDown === 0 ? 'GO' : '')}`;
        const textWidth = this.context.measureText(text).width;
        const textHeight = HUD.TEXT_HEIGTH * screenSize.height;
        this.context.fillText(text,
            textPosition.x - textWidth / 2, textPosition.y - textHeight / 2);
    }

    private getSize(context: CanvasRenderingContext2D): THREE.Vector2 {
        const height = context.canvas.height, width = context.canvas.width;
        return new THREE.Vector2(width, height);
    }

    private getTextPosition(context: CanvasRenderingContext2D, proportionalPosition: THREE.Vector2): THREE.Vector2 {
        return proportionalPosition.clone().multiply(this.getSize(context));
    }

    private setupTextStyle(): void {
        const size = this.getSize(this.context);
        this.context.font = HUD.getFont(HUD.TEXT_HEIGTH * size.height);
        this.context.fillStyle = HUD.TEXT_COLOR;
        this.context.shadowBlur = 5;
        this.context.shadowColor = 'black';
    }

    private getTime(time: Seconds): Time {
        const formatedTime: any = {};

        formatedTime.milliseconds = (time * 1000) % 1000;
        time = Math.floor(time);
        formatedTime.seconds = time % 60;
        time = Math.floor(time / 60);
        formatedTime.minutes = time % 60;
        formatedTime.hours = Math.floor(time / 60);

        return formatedTime;
    }

    private formatTime(time: Time): string {
        const DISPLAY_PRECISION = 2; // digits
        const hours = HUD.getFormatedNumber(time.hours, DISPLAY_PRECISION);
        const minutes = HUD.getFormatedNumber(time.minutes, DISPLAY_PRECISION);
        const seconds = HUD.getFormatedNumber(time.seconds, DISPLAY_PRECISION);
        const hundredths = HUD.getFormatedNumber(time.milliseconds / 10, DISPLAY_PRECISION);
        return (time.hours > 0 ? `${hours}h ` : '') +
            `${minutes}\' ${seconds}.${hundredths}"`;
    }
}
