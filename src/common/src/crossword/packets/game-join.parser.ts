import { PacketParser } from '../../communication/packet-api';
import { Parser } from '../../communication/packet-api/packet-handler';
import { GameJoinPacket } from './game-join.packet';
import { SIZE_UINT32, SIZE_UINT16 } from '../../index';

@Parser(GameJoinPacket)
export class GameJoinParser extends PacketParser<GameJoinPacket> {

    public serialize(value: GameJoinPacket): ArrayBuffer {
        const BUFFER: ArrayBuffer =
            new ArrayBuffer(2 * SIZE_UINT32 + SIZE_UINT16 * value.playerName.length);
        const DATA = new DataView(BUFFER);
        DATA.setUint32(0, value.gameId);
        DATA.setUint32(1 * SIZE_UINT32, value.playerName.length);
        for (let i = 0; i < value.playerName.length; i++) {
            DATA.setUint16(2 * SIZE_UINT32 + i * SIZE_UINT16, value.playerName.charCodeAt(i));
        }
        return BUFFER;
    }

    public parse(data: ArrayBuffer): GameJoinPacket {
        const VIEW = new DataView(data);
        const GAME_ID = VIEW.getUint32(0);
        const STRING_LENGTH = VIEW.getUint32(1 * SIZE_UINT32);
        let playerName = '';
        for (let i = 0; i < STRING_LENGTH; i++) {
            const CHAR_CODE = VIEW.getUint16(2 * SIZE_UINT32 + i * SIZE_UINT16);
            playerName += String.fromCharCode(
                CHAR_CODE
            );
        }

        return new GameJoinPacket(GAME_ID, playerName);
    }

}
