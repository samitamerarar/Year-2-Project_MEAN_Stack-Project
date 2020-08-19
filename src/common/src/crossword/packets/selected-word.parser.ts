import { Parser, PacketParser, SIZE_UINT32 } from '../../index';
import { SelectedWordPacket } from './selected-word.packet';

@Parser(SelectedWordPacket)
export class SelectedWordParser extends PacketParser<SelectedWordPacket> {

    public serialize(value: SelectedWordPacket): ArrayBuffer {
        const BUFFER = new ArrayBuffer(2 * SIZE_UINT32);
        const DATA = new DataView(BUFFER);
        DATA.setInt32(0 * SIZE_UINT32, value.direction);
        DATA.setInt32(1 * SIZE_UINT32, value.id);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): SelectedWordPacket {
        const WORD = new SelectedWordPacket();
        const VIEW = new DataView(data);
        WORD.direction = VIEW.getInt32(0 * SIZE_UINT32);
        WORD.id        = VIEW.getInt32(1 * SIZE_UINT32);
        return WORD;
    }

}
