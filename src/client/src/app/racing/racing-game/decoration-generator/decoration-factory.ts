import { Tree } from '../models/decoration/tree';
import { Bush } from '../models/decoration/bush';
import { Building } from '../models/decoration/building';
import { Decoration } from '../models/decoration/decoration';

export enum DecorationType {
    TREE,
    BUSH,
    BUILDING,
    COUNT
}

export class DecorationFactory {

    constructor() {
    }

    public getClassInstance(className: DecorationType): Decoration {
        switch (className) {
            case DecorationType.TREE: return new Tree();
            case DecorationType.BUSH: return new Bush();
            case DecorationType.BUILDING: return new Building();
        }
    }
}
