import { Parser, PacketParser, SIZE_UINT32 } from '../../index';
import { WordGuessResultPacket } from './word-guess-result.packet';
import { GridWordParseUtil } from './utils/grid-word-parse-util';

@Parser(WordGuessResultPacket)
export class WordGuessResultParser extends PacketParser<WordGuessResultPacket> {

    public serialize(value: WordGuessResultPacket): ArrayBuffer {
        let dataLength = SIZE_UINT32;
        if (value.found) {
            dataLength += GridWordParseUtil.bufferSizeOf(value.word);
        }
        const BUFFER: ArrayBuffer = new ArrayBuffer(dataLength);
        const DATA = new DataView(BUFFER);

        DATA.setUint8(0, value.found ? 1 : 0);
        if (value.found) {
            GridWordParseUtil.serializeToBuffer(value.word, BUFFER, SIZE_UINT32);
        }
        return BUFFER;
    }

    public parse(data: ArrayBuffer): WordGuessResultPacket {
        const VIEW = new DataView(data);
        const PACKET = new WordGuessResultPacket();
        PACKET.found = VIEW.getUint8(0) !== 0 ? true : false;
        if (PACKET.found) {
            PACKET.word = GridWordParseUtil.parseFromBuffer(data, SIZE_UINT32);
        }
        else {
            PACKET.word = null;
        }
        return PACKET;
    }

}
