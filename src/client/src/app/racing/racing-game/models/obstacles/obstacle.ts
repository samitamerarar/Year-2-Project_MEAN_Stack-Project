import { CollidableMesh } from '../../physic/collidable';
import { Loadable } from '../../../../loadable';

export abstract class Obstacle extends CollidableMesh implements Loadable {
    public readonly mass = 0;
    public abstract readonly waitToLoad: Promise<void>;
}
