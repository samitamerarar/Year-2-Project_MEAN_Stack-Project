import { Drawable } from './drawable';
import { Point } from '../../../../../../common/src/math/point';
import { Pothole } from '../pothole';
import { NormalPothole } from './normal-pothole';
import { ItemGenerator } from '../items/item-generator';
import { MapEditorService } from '../map-editor.service';
import { SpeedBoost } from '../speed-boost';
import { NormalSpeedBoost } from './normal-speed-boost';
import { NormalPuddle } from './normal-puddle';
import { Puddle } from '../puddle';

export class MapItems implements Drawable {

    private context: CanvasRenderingContext2D;
    private itemGenerator = new ItemGenerator();
    private drawablePotholes: NormalPothole[] = [];
    private drawableSpeedBoosts: NormalSpeedBoost[] = [];
    private drawablePuddles: NormalPuddle[] = [];

    constructor(context: CanvasRenderingContext2D, private mapEditor: MapEditorService) {
        this.context = context;
    }

    public convertPotholes(potholes: Pothole[]): void {
        this.drawablePotholes = [];
        for (let i = 0; i < potholes.length; i++) {
            const point = this.itemGenerator.itemCoordinates(this.mapEditor.currentMap, potholes[i]);
            this.drawablePotholes.push(new NormalPothole(this.context, point.x, point.y));
        }
    }

    public convertSpeedBoosts(speedBoost: SpeedBoost[]): void {
        this.drawableSpeedBoosts = [];
        for (let i = 0; i < speedBoost.length; i++) {
            const point = this.itemGenerator.itemCoordinates(this.mapEditor.currentMap, speedBoost[i]);
            this.drawableSpeedBoosts.push(new NormalSpeedBoost(this.context, point.x, point.y));
        }
    }

    public convertPuddle(puddle: Puddle[]): void {
        this.drawablePuddles = [];
        for (let i = 0; i < puddle.length; i++) {
            const point = this.itemGenerator.itemCoordinates(this.mapEditor.currentMap, puddle[i]);
            this.drawablePuddles.push(new NormalPuddle(this.context, point.x, point.y));
        }
    }

    public draw(): void {
        this.convertPotholes(this.mapEditor.currentMap.potholes);
        this.convertSpeedBoosts(this.mapEditor.currentMap.speedBoosts);
        this.convertPuddle(this.mapEditor.currentMap.puddles);

        if (this.mapEditor.currentMap.potholes.length === 0) {
            this.deletePotholes();
        }
        else {
            for (let i = 0; i < this.drawablePotholes.length; i++) {
                this.drawablePotholes[i].draw();
            }
        }

        if (this.mapEditor.currentMap.speedBoosts.length === 0) {
            this.deleteSpeedBoosts();
        }
        else {
            for (let i = 0; i < this.drawableSpeedBoosts.length; i++) {
                this.drawableSpeedBoosts[i].draw();
            }
        }

        if (this.mapEditor.currentMap.puddles.length === 0) {
            this.deletePuddles();
        }
        else {
            for (let i = 0; i < this.drawablePuddles.length; i++) {
                this.drawablePuddles[i].draw();
            }
        }

    }

    private deletePotholes(): void {
        const AMOUNT_OF_ITEMS = this.drawablePotholes.length;

        for (let i = 0; i < AMOUNT_OF_ITEMS; i++) {
            this.drawablePotholes.pop();
        }
    }

    private deleteSpeedBoosts(): void {
        const AMOUNT_OF_ITEMS = this.drawableSpeedBoosts.length;

        for (let i = 0; i < AMOUNT_OF_ITEMS; i++) {
            this.drawableSpeedBoosts.pop();
        }
    }

    private deletePuddles(): void {
        const AMOUNT_OF_ITEMS = this.drawablePuddles.length;

        for (let i = 0; i < AMOUNT_OF_ITEMS; i++) {
            this.drawablePuddles.pop();
        }
    }
}
