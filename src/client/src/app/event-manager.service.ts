import { Injectable } from '@angular/core';
import { InstanceOf, NotImplementedError, Class } from '../../../common/src/utils';

/**
 * @class
 * The class representation of an event.
 */
class EventBis<T = any> {
    constructor(
    /**
     * The event's name.
     */
    public readonly name: string,
    /**
     * The event's payload.
     */
    public data: T) { }
}

export declare type Listener = <E extends EventBis>(event: E) => void;
declare type FieldName = string | symbol;

const EVENT_LISTENERS_PROPERTY_NAMES: Map<InstanceOf<Class<any>>, Map<string, FieldName>> = new Map();
const registeredInstances: Set<InstanceOf<Class<any>>> = new Set();

@Injectable()
export class EventManager {
    private static readonly INSTANCE = new EventManager();

    private readonly eventListeners: Map<string, Set<Listener>> = new Map();
    private readonly eventListenersOnce: Map<string, Set<Listener>> = new Map();

    public static getInstance(): EventManager {
        return EventManager.INSTANCE;
    }

    public static Listener(eventType: string): MethodDecorator {
        return <T extends Class>(prototype: InstanceOf<T>, propertyName: FieldName, descriptor: PropertyDescriptor): void => {
            const eventListeners = new Map(EVENT_LISTENERS_PROPERTY_NAMES.get(prototype));
            if (!EVENT_LISTENERS_PROPERTY_NAMES.has(prototype)) {
                EVENT_LISTENERS_PROPERTY_NAMES.set(prototype, new Map());
            }
            EVENT_LISTENERS_PROPERTY_NAMES.get(prototype).set(eventType, propertyName);
        };
    }

    private constructor() { }

    public registerClass<T extends Class = any>(instance: InstanceOf<T>, prototype?: InstanceOf<T>): void {
        prototype = prototype || Object.getPrototypeOf(instance);
        const handlersName = EVENT_LISTENERS_PROPERTY_NAMES.get(prototype) || new Map<string, FieldName>();
        if (!registeredInstances.has(instance)) {
            registeredInstances.add(instance);
            for (const [eventType, propertyName] of handlersName) {
                this.addListener(eventType, instance[propertyName].bind(instance));
            }
        }
    }

    public addListener(type: string, listener: Listener): void {
        if (!this.eventListeners.has(type)) {
            this.eventListeners.set(type, new Set());
        }
        this.eventListeners.get(type).add(listener);
    }

    public addListenerOnce(type: string, listener: Listener): void {
        if (!this.eventListenersOnce.has(type)) {
            this.eventListenersOnce.set(type, new Set());
        }
        this.eventListenersOnce.get(type).add(listener);
    }

    public removeListener(type: string, listener: Listener): void {
        if (this.eventListeners.has(type)) {
            this.eventListeners.get(type).delete(listener);
        }
        if (this.eventListenersOnce.has(type)) {
            this.eventListenersOnce.get(type).delete(listener);
        }
    }

    public fireEvent<E extends EventBis>(type: string, event: E): void {
        const LISTENERS = this.eventListeners.get(type);
        if (LISTENERS !== undefined) {
            for (const listener of LISTENERS) {
                setTimeout(listener(event), 0); // Make it asynchronous
            }
        }
        this.fireEventOnce(type, event);
    }

    private fireEventOnce<E extends EventBis>(type: string, event: E): void {
        const LISTENERS = this.eventListenersOnce.get(type);
        if (LISTENERS !== undefined) {
            for (const listener of LISTENERS) {
                setTimeout(listener(event), 0);
            }
            LISTENERS.clear();
        }
    }
}

export const eventManagerValue = EventManager.getInstance();

export namespace EventManager {
    export declare type Event<T = any> = EventBis<T>;
}
