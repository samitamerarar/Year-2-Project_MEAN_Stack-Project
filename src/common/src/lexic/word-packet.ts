import { PacketParser } from '../communication/packet-api';
import { WordConstraint } from './word-constraint';
import { CharConstraint } from './char-constraint';
import { Parser } from '../communication/packet-api/packet-handler';

// Example of an implementation of a Packet for the class WorkConstraint
@Parser(WordConstraint)
export class WordConstraintPacketParser extends PacketParser<WordConstraint> {
    public serialize(value: WordConstraint): ArrayBuffer {
        const SIZE_UINT8 = 1, SIZE_UINT32 = 4;
        const BUFFER: ArrayBuffer = new ArrayBuffer(2 * SIZE_UINT32 + SIZE_UINT8 +
            value.charConstraints.length * (SIZE_UINT8 + SIZE_UINT32));
        const DATA = new DataView(BUFFER);
        let offset = 0;
        const pushUint32 = (uint: number) => { DATA.setUint32(offset, uint); offset += SIZE_UINT32; };
        const pushInt32 = (int: number) => { DATA.setInt32(offset, int); offset += SIZE_UINT32; };
        const pushUint8 = (byte: number) => { DATA.setUint8(offset, byte); offset += SIZE_UINT8; };
        pushUint32(value.minLength);
        pushInt32(value.maxLength || -1);
        pushUint8(+value.isCommon);
        let charConstraint: CharConstraint;
        for (let i = 0; i < value.charConstraints.length; ++i) {
            charConstraint = value.charConstraints[i];
            pushUint8(charConstraint.char.charCodeAt(0));
            pushUint32(charConstraint.position);
        }
        return BUFFER;
    }

    public parse(data: ArrayBuffer): WordConstraint {
        let minLength: number,
            maxLength: number,
            isCommon: boolean,
            // tslint:disable-next-line:prefer-const
            charConstraints: CharConstraint[] = [];
        const VIEW = new DataView(data);
        minLength = VIEW.getUint32(0);
        maxLength = VIEW.getInt32(4);
        isCommon = VIEW.getUint8(8) !== 0;
        for (let i = 9; i < data.byteLength; i += 5) {
            const charConstraint: CharConstraint = {
                char: String.fromCharCode(VIEW.getUint8(i)),
                position: VIEW.getUint32(i + 1)
            };
            charConstraints.push(charConstraint);
        }
        let returnedConstraint;
        if (maxLength > -1) {
            returnedConstraint = <WordConstraint>{ minLength, maxLength, isCommon, charConstraints };
        } else {
            returnedConstraint = <WordConstraint>{ minLength, isCommon, charConstraints };
        }
        returnedConstraint.constructor = WordConstraint;
        Object.setPrototypeOf(returnedConstraint, WordConstraint.prototype);
        return returnedConstraint;
    }
}
