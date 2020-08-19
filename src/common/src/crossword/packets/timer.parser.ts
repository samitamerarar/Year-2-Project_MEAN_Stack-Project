import { PacketParser } from '../../communication/packet-api';
import { Parser, SIZE_UINT32 } from '../../communication/packet-api/packet-handler';
import { TimerPacket } from './timer.packet';

@Parser(TimerPacket)
export class TimerParser extends PacketParser<TimerPacket> {

    public serialize(value: TimerPacket): ArrayBuffer {
        const BUFFER: ArrayBuffer = new ArrayBuffer(1 * SIZE_UINT32);
        const DATA = new DataView(BUFFER);

        DATA.setInt32(0 * SIZE_UINT32, value.countdown);

        return BUFFER;
    }

    public parse(data: ArrayBuffer): TimerPacket {
        const VIEW = new DataView(data);

        const countdown = VIEW.getInt32(0);

        return new TimerPacket(countdown);
    }

}
