import { Injectable } from '@angular/core';
import { PacketManagerClient } from '../../packet-manager-client';
import { PacketEvent, PacketHandler, registerHandlers } from '../../../../../common/src/index';
import { TimerPacket } from '../../../../../common/src/crossword/packets';
import '../../../../../common/src/crossword/packets/timer.parser';

@Injectable()
export class GameDetailsService {

    public countdown = 0;

    // tslint:disable-next-line:no-unused-variable
    constructor(private packetManager: PacketManagerClient) {
        registerHandlers(this, packetManager);
    }

    @PacketHandler(TimerPacket)
    // tslint:disable-next-line:no-unused-variable
    private handleCrosswordTimer(event: PacketEvent<TimerPacket>) {
        this.countdown = event.value.countdown;
    }

}
