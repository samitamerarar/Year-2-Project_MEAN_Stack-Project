import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { GameDefinitionPacket } from './game-definition.packet';
import { Definition } from '../definition';

const SIZE_UINT16 = 2, SIZE_UINT32 = 4;

@Parser(GameDefinitionPacket)
export class GameDefinitionParser extends PacketParser<GameDefinitionPacket> {

    public serialize(value: GameDefinitionPacket): ArrayBuffer {
        const DEFINITION_TEXT_LENGTH = value.definition.text.length;
        const DIRECTION = value.direction;
        const BUFFER: ArrayBuffer = new ArrayBuffer(3 * SIZE_UINT32 + DEFINITION_TEXT_LENGTH * SIZE_UINT16);

        const DATA = new DataView(BUFFER);

        DATA.setInt32(0 * SIZE_UINT32, value.index);
        DATA.setInt32(1 * SIZE_UINT32, DIRECTION);
        DATA.setInt32(2 * SIZE_UINT32, DEFINITION_TEXT_LENGTH);
        for (let i = 0; i < DEFINITION_TEXT_LENGTH; i++) {
            DATA.setUint16(3 * SIZE_UINT32 + SIZE_UINT16 * i, value.definition.text.charCodeAt(i));
        }
        return BUFFER;
    }

    public parse(data: ArrayBuffer): GameDefinitionPacket {
        const VIEW = new DataView(data);
        const INDEX = VIEW.getInt32(0);
        const DIRECTION = VIEW.getInt32(0 + SIZE_UINT32);
        const DEFINITION_TEXT_LENGTH = VIEW.getInt32(0 + 2 * SIZE_UINT32);

        let buffer = '';
        for (let i = 0; i < DEFINITION_TEXT_LENGTH; i++) {
            buffer += String.fromCharCode(VIEW.getUint16(i * SIZE_UINT16 + 3 * SIZE_UINT32));
        }
        return new GameDefinitionPacket(INDEX, DIRECTION, new Definition(buffer, DIRECTION));
    }

}
