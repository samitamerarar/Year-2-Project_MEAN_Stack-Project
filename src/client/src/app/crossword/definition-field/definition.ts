import { Direction } from '../../../../../common/src/crossword/crossword-enums';
import { Definition as SerializedDefinition } from '../../../../../common/src/crossword/definition';

export class Definition {

    public static deserialize(index: number,
                              serializedDefinition: SerializedDefinition): Definition {
        return new Definition(
            index,
            serializedDefinition.direction,
            serializedDefinition.text
        );
    }

    constructor(public index: number = -1,
                public direction: Direction = null,
                public text: string) {}

}
