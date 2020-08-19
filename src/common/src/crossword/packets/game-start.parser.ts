import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { GameStartPacket } from './game-start.packet';

@Parser(GameStartPacket)
export class GameStartParser extends PacketParser<GameStartPacket> {

    public serialize(value: GameStartPacket): ArrayBuffer {
        const BUFFER: ArrayBuffer = new ArrayBuffer(0);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): GameStartPacket {
        return new GameStartPacket();
    }

}
