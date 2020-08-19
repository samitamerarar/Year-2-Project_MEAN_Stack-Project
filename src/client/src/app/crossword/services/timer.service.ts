import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { PacketManagerClient } from '../../packet-manager-client';
import { TimerPacket } from '../../../../../common/src/crossword/packets';
import { PacketHandler, PacketEvent, registerHandlers } from '../../../../../common/src/index';
import '../../../../../common/src/crossword/packets/timer.parser';
import { Subscription } from 'rxjs/Subscription';
import { Seconds } from '../../types';

@Injectable()
export class TimerService {

    private static DEFAULT_TIME: Seconds = 120;

    private timerInternal = new Subject<number>();
    private timerValueInternal: number;
    private serverTimerSubscription: Subscription;

    constructor(private packetManager: PacketManagerClient) {
        this.timer.subscribe((value) => {
            this.timerValueInternal = value;
        });
        this.timer.next(TimerService.DEFAULT_TIME);
        this.serverTimerSubscription =
            this.subscribeServerToTimeChanges();
        registerHandlers(this, packetManager);
    }

    public get timer(): Subject<number> {
        return this.timerInternal;
    }

    public get timerValue(): number {
        return this.timerValueInternal;
    }

    @PacketHandler(TimerPacket)
    // tslint:disable-next-line:no-unused-variable
    private timeChanged(event: PacketEvent<TimerPacket>) {
        this.serverTimerSubscription.unsubscribe();
        this.timer.next(event.value.countdown);
        this.serverTimerSubscription =
            this.subscribeServerToTimeChanges();
    }

    private subscribeServerToTimeChanges(): Subscription {
        return this.timer.subscribe((value) => {
            this.packetManager.sendPacket(
                TimerPacket,
                new TimerPacket(value)
            );
        });
    }

}
