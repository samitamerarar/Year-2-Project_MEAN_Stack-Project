import { fromArrayBuffer, Class } from '../../common/src/utils';
import { PacketManagerBase } from '../../common/src/communication/packet-api/packet-manager-base';
import * as ServerIO from 'socket.io';
import { Server } from 'http';

export class PacketManagerServer extends PacketManagerBase<SocketIO.Socket> {
    private static instance: PacketManagerServer = null;
    private readonly knownSockets: Map<string, SocketIO.Socket> = new Map();

    public static getInstance(): PacketManagerServer {
        if (!PacketManagerServer.instance) {
            PacketManagerServer.instance = new PacketManagerServer(ServerIO(new Server()).attach(3030));
        }
        return PacketManagerServer.instance;
    }

    private constructor(private serverSocket: SocketIO.Server) {
        super();
        this.register();
        this.serverSocket.on('connection', this.onConnection.bind(this));
    }

    private onConnection(socket: SocketIO.Socket) {
        this.logger.log(`New connection on "${socket.handshake.url}" (id: ${socket.id})`);
        this.knownSockets.set(socket.id, socket);
        this.registerParsersToSocket(socket);
        socket.on('disconnect', () => {
            this.logger.log(`Disconnection (id: ${socket.id})`);
            this.diconnectHandlers.forEach((handler) => handler(socket.id));
            this.knownSockets.delete(socket.id);
        });
    }

    public sendPacket<T>(type: Class<T>, data: T, socketId: string): boolean;
    public sendPacket<T>(type: Class<T>, data: T, socketId: string[]): boolean[];
    public sendPacket<T>(type: Class<T>, data: T, socketId: string | string[]): boolean | boolean[] {
        let success: boolean | boolean[];
        if (Array.isArray(socketId)) {
            const socketIds: string[] = socketId;
            success = [] as boolean[];
            for (socketId of socketIds) {
                success.push(this.sendPacketToSocket(type, data, socketId));
            }
        }
        else {
            success = this.sendPacketToSocket(type, data, socketId);
        }
        return success;
    }

    private sendPacketToSocket<T>(type: Class<T>, data: T, socketId: string): boolean {
        if (this.parsers.has(type) && this.knownSockets.has(socketId)) {
            const parser = this.parsers.get(type);
            this.logger.debug(`Sending: {socket "${socketId}"} "${type.name}" ${data}`);
            let serializedData;
            try {
                serializedData = parser.serialize(data);
            } catch (error) {
                this.logger.warn(`An error occured while serializing ${type.name}:`,
                    error instanceof Error ? error.message : error);
                return false;
            }
            this.knownSockets.get(socketId).send('packet:' + type.name,
                fromArrayBuffer(serializedData));
            return true;
        } else if (!this.parsers.has(type)) {
            this.logger.warn(`No parser for packet with "${type.name}" type. Packet dropped`);
        }
        return false;
    }
}
