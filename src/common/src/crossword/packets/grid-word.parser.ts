import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { GridWordPacket } from './grid-word.packet';
import { GridWordParseUtil } from './utils/grid-word-parse-util';

@Parser(GridWordPacket)
export class GridWordParser extends PacketParser<GridWordPacket> {

    public serialize(value: GridWordPacket): ArrayBuffer {
        const BUFFER: ArrayBuffer = new ArrayBuffer(GridWordParseUtil.bufferSizeOf(value.gridword));
        GridWordParseUtil.serializeToBuffer(value.gridword, BUFFER, 0);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): GridWordPacket {
        return new GridWordPacket(GridWordParseUtil.parseFromBuffer(data, 0));
    }

}
