import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { ClearGridPacket } from './clear-grid.packet';

@Parser(ClearGridPacket)
export class ClearGridParser extends PacketParser<ClearGridPacket> {

    public serialize(value: ClearGridPacket): ArrayBuffer {
        const BUFFER: ArrayBuffer = new ArrayBuffer(0);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): ClearGridPacket {
        return new ClearGridPacket();
    }

}
