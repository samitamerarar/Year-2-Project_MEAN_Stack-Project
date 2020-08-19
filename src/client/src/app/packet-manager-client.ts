import 'socket.io-client';
import { Constructor, fromArrayBuffer } from '../../../common/src/utils';
import { PacketManagerBase } from '../../../common/src/communication/packet-api/packet-manager-base';
import { Injectable } from '@angular/core';

@Injectable()
export class PacketManagerClient extends PacketManagerBase<SocketIOClient.Socket> {
    constructor(private socket: SocketIOClient.Socket) {
        super();
        this.register();
        this.registerParsersToSocket(this.socket);
        socket.on('disconnect', () => {
            this.diconnectHandlers.forEach((handler) => handler(socket.id));
        });
    }

    public sendPacket<T>(type: Constructor<T>, data: T): boolean {
        if (this.parsers.has(type)) {
            const parser = this.parsers.get(type);
            this.logger.debug(`Sending: {to server} "${type.name}"`, data);
            this.socket.send('packet:' + type.name,
                fromArrayBuffer(parser.serialize(data)));
            return this.socket.connected;
        } else {
            this.logger.warn(`No parser for packet with "${type.name}" type. Packet dropped`);
            return false;
        }
    }
}
