import { Constructor, Class, InstanceOf } from '../../utils';
import { PacketParser } from './packet-parser';
import { PacketEvent } from './packet-event';
import { PacketManagerBase, Socket } from './packet-manager-base';
import { Logger } from '../../logger';

const parsers: [Class<any>, Constructor<PacketParser<any>>][] = [];

const logger = Logger.getLogger('Packet Decorators');
const DEFAULT_CLASSNAME = '<Annonymous>';

export const SIZE_UINT8 = 1, SIZE_UINT16 = 2, SIZE_UINT32 = 4;

// Decorator
export function Parser<T>(type: Class<T>) {
    return function Parser<P extends PacketParser<T>>(constructor: Constructor<P>) {
        logger.info(`New parser for ${type.name} [${constructor.name}]`);
        parsers.push([type, constructor]);
    };
}

export function registerParsers(packetManager: PacketManagerBase<any>): void {
    for (const parser of parsers) {
        packetManager.registerParser(parser[0], new (parser[1]));
    }
}

const handlers: Map<Class<any>, Map<Class<any>, Set<string>>> = new Map();
export declare type PacketHandler<T> = (event: PacketEvent<T>) => void;
declare type PacketHandlerDescriptor<T> = PropertyDescriptor & { value?: PacketHandler<T> };

// Decorator
export function PacketHandler<T>(dataType: Class<T>): MethodDecorator {
    return function <U extends Class>(target: InstanceOf<U>, propertyKey: string, descriptor: PacketHandlerDescriptor<T>) {
        logger.info(`New handler for %s [%s.%s]`, dataType.name, target.constructor.name || DEFAULT_CLASSNAME, propertyKey);
        if (!handlers.has(target.constructor)) {
            handlers.set(target.constructor, new Map());
        }
        if (!handlers.get(target.constructor).has(dataType)) {
            handlers.get(target.constructor).set(dataType, new Set());
        }
        handlers.get(target.constructor).get(dataType).add(propertyKey);
    };
}

export declare interface PacketManagerContainter<S extends Socket> {
    packetManager: PacketManagerBase<S>;
}

export function PacketHandlerClass() {
    return function <T extends Constructor<PacketManagerContainter<Socket>>>(target: T) {
        logger.info('New class of handlers: %s', target.name || DEFAULT_CLASSNAME);
        if (!handlers.has(target)) {
            handlers.set(target, new Map());
        }
        return class extends target {
            constructor(...argv: any[]) {
                super(...argv);
                registerHandlers(this, this.packetManager);
            }
        } as T;
    };
}

export function registerHandlers<T extends InstanceOf<any>>(that: T, packetManager: PacketManagerBase<Socket>) {
    logger.info(`(class %s) Registering handlers`, that.constructor.name || DEFAULT_CLASSNAME);
    const TRY_COUNT_MAX = 100;
    let prototype = that, i = 0;
    let thatHandlers: Map<Class<any>, Set<string>>;
    while (!handlers.has(prototype.constructor) && ++i < TRY_COUNT_MAX) {
        prototype = Object.getPrototypeOf(prototype);
    }
    thatHandlers = handlers.get(prototype.constructor);
    if (thatHandlers !== undefined) {
        thatHandlers.forEach((handlerList, type) => {
            for (const handler of handlerList) {
                packetManager.registerHandler(type, that[handler].bind(that));
            }
        });
    }
}
