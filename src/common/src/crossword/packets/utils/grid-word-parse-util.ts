import { GridWord } from '../../grid-word';
import { SIZE_UINT32, SIZE_UINT16 } from '../../../index';

/**
 * @class GridWordParseUtil
 * @description Manages the serialization and parsing of GridWords.
 */
export class GridWordParseUtil {

    public static bufferSizeOf(word: GridWord): number {
        return 7 * SIZE_UINT32 + SIZE_UINT16 * word.string.length;
    }

    public static parseFromBuffer(buffer: ArrayBuffer,
                                  offset: number): GridWord {
        const VIEW = new DataView(buffer);
        const GRID_WORD = new GridWord();
        GRID_WORD.id        = VIEW.getInt32(offset + 0 * SIZE_UINT32);
        GRID_WORD.y         = VIEW.getInt32(offset + 1 * SIZE_UINT32);
        GRID_WORD.x         = VIEW.getInt32(offset + 2 * SIZE_UINT32);
        GRID_WORD.length    = VIEW.getInt32(offset + 3 * SIZE_UINT32);
        GRID_WORD.direction = VIEW.getInt32(offset + 4 * SIZE_UINT32);
        GRID_WORD.owner     = VIEW.getInt32(offset + 5 * SIZE_UINT32);

        const STRING_LENGTH = VIEW.getInt32(offset + 6 * SIZE_UINT32);
        let stringValue = '';
        for (let i = 0; i < STRING_LENGTH; i++) {
            const CHAR_CODE = VIEW.getUint16(offset + 7 * SIZE_UINT32 + i * SIZE_UINT16);
            stringValue += String.fromCharCode(
                CHAR_CODE
            );
        }
        GRID_WORD.string = stringValue;

        return GRID_WORD;
    }

    public static serializeToBuffer(word: GridWord,
                                    buffer: ArrayBuffer,
                                    offset: number): void {
        const DATA = new DataView(buffer);

        DATA.setInt32(0 * SIZE_UINT32, word.id);
        DATA.setInt32(1 * SIZE_UINT32, word.y);
        DATA.setInt32(2 * SIZE_UINT32, word.x);
        // Be careful: this length is different from the actual string length
        DATA.setInt32(3 * SIZE_UINT32, word.length);
        DATA.setInt32(4 * SIZE_UINT32, word.direction);
        DATA.setInt32(5 * SIZE_UINT32, word.owner);
        DATA.setInt32(6 * SIZE_UINT32, word.string.length);

        for (let i = 0; i < word.string.length; i++) {
            DATA.setUint16(7 * SIZE_UINT32 + i * SIZE_UINT16, word.string.charCodeAt(i));
        }
    }

    private constructor() {}

}
