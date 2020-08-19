import { Component, OnInit } from '@angular/core';

import { MapService } from '../racing/services/map.service';
import { SerializedMap } from '../../../../common/src/racing/serialized-map';
import { WordConstraint } from '../../../../common/src/lexic/word-constraint';
import { PacketManagerService } from '../packet-manager.service';
import { Logger } from '../../../../common/src/logger';

@Component({
    selector: 'app-admin-screen',
    templateUrl: './admin-screen.component.html',
    styleUrls: ['./admin-screen.component.css']
})
export class AdminScreenComponent implements OnInit {
    private readonly logger = Logger.getLogger('AdminScreen');
    public readonly JSON = JSON;
    public count = 0;

    public mapNames: string[];
    public selectedMap: string;
    public serializedMap: SerializedMap = new SerializedMap();

    constructor(private packetService: PacketManagerService,
        private mapService: MapService) { }

    public ngOnInit(): void {
        this.getMapsNames();
    }

    public get data() {
        return this.packetService.data;
    }

    public getMapsNames(): void {
        this.mapService.getMapNames(100).then((mapNames) => this.mapNames = mapNames);
    }

    public mapSelected(map: string): void {
        this.selectedMap = map;
        this.mapService.getByName(this.selectedMap).then((serializedMap) => this.serializedMap = serializedMap);
    }

    public keepAllMapsExcept(map: string): void {
        this.mapNames = this.mapNames.filter((name: string) => name !== map);
    }

    public addMap(map: string): void {
        this.keepAllMapsExcept(map);
        this.mapNames.push(map);
    }

    public alertMapCouldNotBeSavedBecuaseAlreadyExists(): void {
        alert('Map could not be saved:\n' +
              'A map with that name already exists.');
    }

    public alertMapCouldNotBeSavedBecauseNotFound(): void {
        alert('Map could not be edited:\n' +
              'No map with that name exists.');
    }

    public sendSocket(): void {
        const wc: WordConstraint = { minLength: ++this.count, isCommon: true, charConstraints: [{ char: 'a', position: 0 }] };
        this.logger.debug('Sending to server ...');
        this.packetService.packetManager.sendPacket(WordConstraint, wc);
    }

}
