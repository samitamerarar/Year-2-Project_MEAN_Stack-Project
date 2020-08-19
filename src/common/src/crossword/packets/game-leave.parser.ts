import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { GameLeavePacket } from './game-leave.packet';

@Parser(GameLeavePacket)
export class GameLeaveParser extends PacketParser<GameLeavePacket> {

    public serialize(value: GameLeavePacket): ArrayBuffer {
        const BUFFER: ArrayBuffer = new ArrayBuffer(0);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): GameLeavePacket {
        return new GameLeavePacket();
    }

}
