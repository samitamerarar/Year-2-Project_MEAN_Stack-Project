import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { WordGuessPacket } from './word-guess.packet';
import { GridWordParseUtil } from './utils/grid-word-parse-util';

@Parser(WordGuessPacket)
export class WordGuessParser extends PacketParser<WordGuessPacket> {

    public serialize(value: WordGuessPacket): ArrayBuffer {
        const BUFFER: ArrayBuffer = new ArrayBuffer(GridWordParseUtil.bufferSizeOf(value.wordGuess));
        GridWordParseUtil.serializeToBuffer(value.wordGuess, BUFFER, 0);
        return BUFFER;
    }

    public parse(data: ArrayBuffer): WordGuessPacket {
        return new WordGuessPacket(GridWordParseUtil.parseFromBuffer(data, 0));
    }

}
