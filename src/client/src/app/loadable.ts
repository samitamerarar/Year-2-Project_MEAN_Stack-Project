import { hasAttributes } from '../../../common/src/index';

export interface Loadable {
    readonly waitToLoad: Promise<void>;
}

export function isLoadable(objectToCheck: any): objectToCheck is Loadable {
    return objectToCheck != null && hasAttributes(objectToCheck, [
        { name: 'waitToLoad', parent: Promise }
    ]);
}
