import { TestBed, inject } from '@angular/core/testing';
import { EventManager } from './event-manager.service';

class Foo {
    constructor(private eventManager: EventManager) {
        this.eventManager.registerClass(this);
    }

    @EventManager.Listener('myEvent')
    // tslint:disable-next-line:no-unused-variable
    private myEventListener(event: EventManager.Event<number>) {
        event.data *= 2;
    }
}

describe('EventManager', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: EventManager, useValue: EventManager.getInstance() }
            ]
        });
    });

    beforeEach(inject([EventManager], (eventManager: EventManager) => {
        eventManager['eventListeners'].clear();
        eventManager['eventListenersOnce'].clear();
    }));

    it('should be created', inject([EventManager], (service: EventManager) => {
        expect(service).toBeTruthy();
    }));

    it('should register a given listener for a given event', inject([EventManager], (service: EventManager) => {
        const EVENT_NAME = 'myEvent', LISTENER = (event: EventManager.Event<string>) => { };
        expect(service['eventListeners'].get(EVENT_NAME)).toBeUndefined();
        service.addListener(EVENT_NAME, LISTENER);
        expect(service['eventListeners'].get(EVENT_NAME)).toBeTruthy();
        expect(service['eventListeners'].get(EVENT_NAME).size).toEqual(1);

        expect(service['eventListenersOnce'].get(EVENT_NAME)).toBeUndefined();
        service.addListenerOnce(EVENT_NAME, LISTENER);
        expect(service['eventListenersOnce'].get(EVENT_NAME)).toBeTruthy();
        expect(service['eventListenersOnce'].get(EVENT_NAME).size).toEqual(1);
    }));

    it('should be able to remove a listener previously added', inject([EventManager], (service: EventManager) => {
        const EVENT_NAME = 'myEvent', LISTENER = (event: EventManager.Event<string>) => { };
        service['eventListeners'].set(EVENT_NAME, new Set([LISTENER]));
        expect(service['eventListeners'].get(EVENT_NAME)).toBeTruthy();
        expect(service['eventListeners'].get(EVENT_NAME).size).toEqual(1);
        service.removeListener(EVENT_NAME, LISTENER);
        expect(service['eventListeners'].get(EVENT_NAME)).toBeTruthy();
        expect(service['eventListeners'].get(EVENT_NAME).size).toEqual(0);

        service['eventListenersOnce'].set(EVENT_NAME, new Set([LISTENER]));
        expect(service['eventListenersOnce'].get(EVENT_NAME)).toBeTruthy();
        expect(service['eventListenersOnce'].get(EVENT_NAME).size).toEqual(1);
        service.removeListener(EVENT_NAME, LISTENER);
        expect(service['eventListenersOnce'].get(EVENT_NAME)).toBeTruthy();
        expect(service['eventListenersOnce'].get(EVENT_NAME).size).toEqual(0);
    }));

    it('should fire all and only the listeners registered for the given event', inject([EventManager], (service: EventManager) => {
        interface Spy { value: number; }
        const EVENT_NAME1 = 'myEvent',
            EVENT_NAME2 = 'myOtherEvent',
            LISTENER1 = (event: EventManager.Event<Spy>) => { event.data.value *= 2; },
            LISTENER2 = (event: EventManager.Event<Spy>) => { event.data.value *= 3; },
            LISTENER3 = (event: EventManager.Event<Spy>) => { event.data.value *= 5; };
        service['eventListeners'].set(EVENT_NAME1, new Set([LISTENER1, LISTENER3]));
        service['eventListeners'].set(EVENT_NAME2, new Set([LISTENER2]));

        let event: EventManager.Event<Spy> = { name: EVENT_NAME1, data: { value: 1 } };
        service.fireEvent(event.name, event);
        expect(event.data.value).toEqual(10);

        event = { name: EVENT_NAME2, data: { value: 1 } };
        service.fireEvent(event.name, event);
        expect(event.data.value).toEqual(3);
    }));

    it('should fire once all and only the listeners registered for the given event and remove them',
        inject([EventManager], (service: EventManager) => {
            interface Spy { value: number; }
            const EVENT_NAME1 = 'myEvent',
                EVENT_NAME2 = 'myOtherEvent',
                LISTENER1 = (event: EventManager.Event<Spy>) => { event.data.value *= 2; },
                LISTENER2 = (event: EventManager.Event<Spy>) => { event.data.value *= 3; },
                LISTENER3 = (event: EventManager.Event<Spy>) => { event.data.value *= 5; };
            service['eventListenersOnce'].set(EVENT_NAME1, new Set([LISTENER1, LISTENER3]));
            service['eventListenersOnce'].set(EVENT_NAME2, new Set([LISTENER2]));

            let event: EventManager.Event<Spy> = { name: EVENT_NAME1, data: { value: 1 } };
            expect(service['eventListenersOnce'].get(EVENT_NAME1).size).toEqual(2);
            service.fireEvent(event.name, event);
            expect(event.data.value).toEqual(10);
            expect(service['eventListenersOnce'].get(EVENT_NAME1).size).toEqual(0);

            event = { name: EVENT_NAME2, data: { value: 1 } };
            expect(service['eventListenersOnce'].get(EVENT_NAME2).size).toEqual(1);
            service.fireEvent(event.name, event);
            expect(event.data.value).toEqual(3);
            expect(service['eventListenersOnce'].get(EVENT_NAME2).size).toEqual(0);
        })
    );

    it('should register from a class its listeners with the EventListener decorator',
        inject([EventManager], (service: EventManager) => {
            const EVENT_NAME = 'myEvent',
            event: EventManager.Event<number> = {name: EVENT_NAME, data: 1},
            // tslint:disable-next-line:no-unused-variable
            myClassInstance: Foo = new Foo(service);

            expect(service['eventListeners'].get(EVENT_NAME).size).toEqual(1);
            service.fireEvent(event.name, event);
            expect(event.data).toEqual(2);
        })
    );
});
