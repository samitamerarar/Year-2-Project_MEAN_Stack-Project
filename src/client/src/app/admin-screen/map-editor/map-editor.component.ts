import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';

import { MapEditorService } from './map-editor.service';
import { MapRendererService } from './map-renderer/map-renderer.service';
import { MapConverterService } from './map-converter.service';
import { RacingUnitConversionService } from './racing-unit-conversion.service';
import { Map as RacingMap, MAP_TYPES, MapError } from './map';
import { Point } from '../../../../../common/src/math/point';
import { PointIndex } from './point-index';
import { SerializedMap } from '../../../../../common/src/racing/serialized-map';
import { MapService } from '../../racing/services/map.service';
import { Track } from '../../racing/track';

const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 2;

const INITIAL_WIDTH = Track.WIDTH_MAX;

@Component({
    selector: 'app-map-editor',
    templateUrl: './map-editor.component.html',
    styleUrls: ['./map-editor.component.css'],
    providers: [
        MapEditorService,
        MapRendererService,
        MapConverterService,
        RacingUnitConversionService
    ]
})
export class MapEditorComponent implements OnInit, AfterViewInit {
    @ViewChild('editingArea') private editingArea: ElementRef;

    public displayable;
    public isDragging = false;
    private isMouseDown = false;
    private hoveredPoint: PointIndex = -1;
    private loadedMapName = '';

    @Output() public mapWasSaved = new EventEmitter<string>();
    @Output() public mapWasDeleted = new EventEmitter<string>();
    @Output() public mapCouldNotBeSavedBecauseAlreadyExists = new EventEmitter<string>();
    @Output() public mapCouldNotBeSavedBecauseNotFound = new EventEmitter<string>();

    constructor(private mapEditor: MapEditorService,
        private mapRenderer: MapRendererService,
        private mapService: MapService) {
        this.width = INITIAL_WIDTH;
        this.displayable = true;
    }

    @Input() public set map(serializedMap: SerializedMap) {
        if (serializedMap.name !== '') {
            this.mapEditor.deserializeMap(serializedMap);
        }
        else {
            this.mapEditor.newMap();
        }
        this.loadedMapName = serializedMap.name;
        if (this.mapRenderer.canvas !== undefined) {
            this.mapRenderer.draw();
        }
    }

    public get internalMap(): RacingMap {
        return this.mapEditor.currentMap;
    }

    public ngOnInit(): void {
        const CANVAS: HTMLCanvasElement = this.editingArea.nativeElement;
        this.mapRenderer.canvas = CANVAS;
    }

    public ngAfterViewInit(): void {
        this.mapRenderer.draw();
    }

    @Input() public set width(width: number) {
        this.mapEditor.mapWidth = width;
    }

    public get width(): number {
        return this.mapEditor.mapWidth;
    }

    @Input() public set height(height: number) {
        this.mapEditor.mapHeight = height;
    }

    public get height(): number {
        return this.mapEditor.mapHeight;
    }

    public get mapTypes(): string[] {
        return MAP_TYPES;
    }

    public get currentMap(): RacingMap {
        return this.mapEditor.currentMap;
    }

    public get isMapValid(): boolean {
        return this.mapEditor.computeMapErrors() === MapError.NONE;
    }

    public get canMapBeSaved(): boolean {
        return this.isMapValid && this.mapEditor.currentMap.name.trim() !== '';
    }

    public get canMapBeDeleted(): boolean {
        return this.loadedMapName !== '' &&
               this.mapEditor.serializeMap().name === this.loadedMapName;
    }

    public saveMap(): void {
        if (this.canMapBeSaved) {
            const SERIALIZED_MAP = this.mapEditor.serializeMap();

            let savePromise: Promise<void>;
            if (SERIALIZED_MAP.name !== this.loadedMapName) {
                this.internalMap.name = SERIALIZED_MAP.name;
                savePromise = this.mapService.saveNew(SERIALIZED_MAP)
                    .catch(() => this.mapCouldNotBeSavedBecauseAlreadyExists.emit(SERIALIZED_MAP.name));
            }
            else {
                savePromise = this.mapService.saveEdited(SERIALIZED_MAP)
                    .catch(() => this.mapCouldNotBeSavedBecauseNotFound.emit(SERIALIZED_MAP.name));
            }

            savePromise.then(() => {
                this.loadedMapName = SERIALIZED_MAP.name;
                this.mapWasSaved.emit(SERIALIZED_MAP.name);
            });
        }
    }

    public deleteMap(): void {
        if (this.canMapBeDeleted) {
            const MAP_NAME = this.mapEditor.currentMap.name;
            this.mapService.delete(MAP_NAME).then(() => {
                this.mapWasDeleted.emit(MAP_NAME);
                this.loadedMapName = '';
            }).catch();
        }
    }

    public potholes(): void {
        this.mapEditor.addPothole();
        this.mapRenderer.draw();
    }

    public puddles(): void {
        this.mapEditor.addPuddles();
        this.mapRenderer.draw();
    }

    public speedBoosts(): void {
        this.mapEditor.addSpeedBoosts();
        this.mapRenderer.draw();
    }

    public randomisePotholes(): void {
        this.mapEditor.randomisePothole();
        this.mapRenderer.draw();
    }

    public randomisePuddles(): void {
        this.mapEditor.randomisePuddles();
        this.mapRenderer.draw();
    }

    public randomiseSpeedBoosts(): void {
        this.mapEditor.randomiseSpeedBoosts();
        this.mapRenderer.draw();
    }

    public clicked(event: MouseEvent): void {
        event.preventDefault();
        if (!this.isDragging) {
            switch (event.button) {
                case LEFT_MOUSE_BUTTON: {
                    this.leftClick(event);
                    break;
                }
                case RIGHT_MOUSE_BUTTON: {
                    this.rightClick(event);
                    break;
                }
            }
        }
        else {
            this.isDragging = false;
        }
    }

    public mouseMoved(event: MouseEvent): void {
        const MOUSE_COORDINATES = new Point(event.offsetX, event.offsetY);

        if (this.isDragging) {
            this.mapEditor.editPoint(this.hoveredPoint, MOUSE_COORDINATES);
        }
        else {
            this.hoveredPoint = this.mapRenderer.activePoint;
        }

        if (this.isMouseDown && this.isHoveringPoint()) {
            this.isDragging = true;
        }

        this.mapRenderer.moveCursorTo(MOUSE_COORDINATES);
        this.mapRenderer.draw();
    }

    public mouseDown(): void {
        this.isMouseDown = true;
    }

    public mouseUp(event: MouseEvent): void {
        this.isMouseDown = false;
    }

    private isHoveringPoint(): boolean {
        return this.hoveredPoint >= 0;
    }

    private leftClick(event: MouseEvent): void {
        if (!this.isHoveringPoint()) {
            this.addPoint(event.offsetX, event.offsetY);
        }
        else if (this.mapEditor.isFirstPoint(this.hoveredPoint)) {
            const FIRST_POINT = this.mapEditor.firstPoint;
            this.addPoint(FIRST_POINT.x, FIRST_POINT.y);
        }
    }

    private rightClick(event: MouseEvent): void {
        this.removePoint();
    }

    private addPoint(x: number, y: number): void {
        this.mapEditor.pushPoint(new Point(x, y));
        this.mapRenderer.draw();
    }

    private removePoint(): void {
        this.mapEditor.popPoint();
        this.mapRenderer.draw();
    }

}
