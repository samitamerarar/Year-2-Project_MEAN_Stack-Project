import { toArrayBuffer, Class } from '../../utils';
import { PacketParser } from './packet-parser';
import { PacketHandler, registerParsers } from './packet-handler';
import { PacketEvent } from './packet-event';
import { Logger } from '../../logger';

export declare type Listener = (...args: any[]) => void;
export declare type On = (event: string, listener: Function | Listener) => { on: On };
export declare interface Socket {
    id: string;
    on: On;
    send: (...argv: any[]) => this;
}

const DEFAULT_NAME = '<Annonymous>';

/**
 * @class
 * @description The base class that is extended by PacketManagerClient and PacketManagerServer
 */
export abstract class PacketManagerBase<Sock extends Socket> {
    private static readonly PACKET_MESSAGE_MATCHER = /^packet:([a-zA-Z_][a-zA-Z0-9_$]*)$/i;

    protected logger = Logger.getLogger('Packet');
    protected parsers: Map<Class, PacketParser<any>> = new Map();
    private handlers: Map<Class, Set<PacketHandler<any>>> = new Map();
    protected diconnectHandlers: Set<(socketId: string) => void> = new Set();

    private static isPacketMessage(message: string): boolean {
        return PacketManagerBase.PACKET_MESSAGE_MATCHER.test(message);
    }

    private static getEventType(message: string): string | null {
        const EVENT_TYPE_GROUP_ID = 1;
        if (PacketManagerBase.isPacketMessage(message)) {
            return message.match(PacketManagerBase.PACKET_MESSAGE_MATCHER)[EVENT_TYPE_GROUP_ID];
        }
        return null;
    }

    /**
     * Must be called at the end of the child class' constructor
     */
    protected register() {
        registerParsers(this);
    }

    /**
     * Add on the socket a listener to packet messages of the type parsed by the parser.
     * @param socket A socket from which we listen a packet message.
     * @param param1 A tuple containing a parser and the type of object it parses.
     */
    protected registerParsersToSocket(socket: Sock) {
        const messageHandler = (message: string, data: string) => {
            if (PacketManagerBase.isPacketMessage(message)) {
                const eventType = PacketManagerBase.getEventType(message);
                let dataType: Class<any>, parser: PacketParser<any>;
                if (this.hasEventType(eventType) &&
                    ([dataType, parser] = this.getParser(eventType)) !== null) {
                    this.logger.debug(`Reception "${eventType}"`);
                    try {
                        const object = parser.parse(toArrayBuffer(data));
                        const handlersCalled = this.callHandlers(dataType, new PacketEvent(object, socket.id));
                        if (!handlersCalled) {
                            this.logger.warn(`No registered handler for packet of type "${eventType}". Packet dropped`);
                        }
                    } catch (error) {
                        this.logger.warn(`An error occured while parsing ${eventType}:`,
                            error instanceof Error ? error.message : error);
                    }
                } else {
                    this.logger.warn(`No parser for packet with "${eventType}" type. Packet dropped`);
                }
            }
        };
        socket.on('message', messageHandler);
    }

    private hasEventType(eventType: string): boolean {
        for (const [dataType] of this.parsers) {
            if (dataType.name === eventType) {
                return true;
            }
        }
        return false;
    }

    private getParser(dataType: string): [Class<any>, PacketParser<any>] {
        for (const parserEntry of this.parsers) {
            if (parserEntry[0].name === dataType) {
                return parserEntry;
            }
        }
        return null;
    }

    private callHandlers<T>(dataType: Class<T>, event: PacketEvent<T>): boolean {
        const HANDLERS = (this.handlers.get(dataType)) as Set<PacketHandler<T>>;
        if (HANDLERS != null && HANDLERS.size > 0) {
            for (const HANDLER of HANDLERS) {
                try {
                    HANDLER(event);
                }
                catch (error) {
                    this.logger.warn(`An error occured while executing ${HANDLER.name}:`,
                        error instanceof Error ? error.message + error.stack : error);
                }
            }
            return true;
        }
        return false;
    }

    /**
     * Register a handler that will be called when receiving a packet of the given type.
     * @param type The data type of the object the handler can handle.
     * @param handler A function that will be called when receiveing a message of the given type.
     * @returns The given handler. Usually useful to keep a reference to the handler and unregister later.
     */
    public registerHandler<T>(type: Class<T>, handler: PacketHandler<T>): PacketHandler<T> {
        this.logger.debug('New handler for %s: %s', type.name || DEFAULT_NAME, handler.name || DEFAULT_NAME);
        if (!this.handlers.has(type)) {
            this.handlers.set(type, new Set<PacketHandler<any>>());
        }
        const handlerList = this.handlers.get(type);
        handlerList.add(handler);
        return handler;
    }

    public unregisterHandler<T>(type: Class<T>, handler: PacketHandler<T>): boolean {
        if (this.handlers.has(type)) {
            return this.handlers.get(type).delete(handler);
        }
        return false;
    }

    /**
     * Send a packet of data to a given destination.
     * @param type The type of the data to send. A parser for that type must have been registered beforehand.
     * @param data The actual data to send.
     * @param socketid (For server side only) The id of the connection to send the data to.
     * @returns True if the packet was succesfully sent, false otherwise (no matching parser, connection error, ...).
     */
    public abstract sendPacket<T>(type: Class<T>, data: T, socketid: string | string[]): boolean | boolean[];

    /**
     * Register a parser for a given type of object.
     * @param type The type of data the parser can parse.
     * @param parser An instance of a class extending PacketParser and implements parse and serialize.
     */
    public registerParser<T>(type: Class<T>, parser: PacketParser<T>) {
        this.logger.info(`Registering parser for ${type.name}`);
        this.parsers.set(type, parser);
    }

    public registerDisconnectHandler(handler: (socketId: string) => void): void {
        this.diconnectHandlers.add(handler);
    }

    public unregisterDisconnectHandler(handler: (socketId: string) => void): void {
        this.diconnectHandlers.delete(handler);
    }
}
