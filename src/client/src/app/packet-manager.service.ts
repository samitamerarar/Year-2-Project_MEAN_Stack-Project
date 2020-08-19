import * as SocketIOClient from 'socket.io-client';
import { Injectable } from '@angular/core';
import { PacketManagerClient } from './packet-manager-client';
import { PacketHandler, WordConstraint, PacketEvent, registerHandlers, Logger } from '../../../common/src';
import '../../../common/src/lexic/word-packet';

export const packetManagerClient: PacketManagerClient = new PacketManagerClient(
    SocketIOClient('http://localhost:3030', {transports: ['websocket', 'polling'] }));

@Injectable()
export class PacketManagerService {
    protected logger: Logger = Logger.getLogger('AdminScreen');
    public data: any;

    constructor(public packetManager: PacketManagerClient) {
        registerHandlers(this, packetManager);
    }

    @PacketHandler(WordConstraint)
    // tslint:disable-next-line:no-unused-variable
    private wordConstraintHandler(event: PacketEvent<WordConstraint>): void {
        this.logger.debug('[AdminScreen] Packet Received', JSON.stringify(event));
        this.data = event.value;
        this.logger.debug('[AdminScreen] data: ', this.data);
    }
}
