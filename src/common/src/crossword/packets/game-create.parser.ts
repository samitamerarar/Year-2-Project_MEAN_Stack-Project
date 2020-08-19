import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { GameCreatePacket } from './game-create.packet';

@Parser(GameCreatePacket)
export class GameCreateParser extends PacketParser<GameCreatePacket> {

    public serialize(value: GameCreatePacket): ArrayBuffer {
        const BUFFER: ArrayBuffer = new ArrayBuffer(0);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): GameCreatePacket {
        return new GameCreatePacket();
    }

}
