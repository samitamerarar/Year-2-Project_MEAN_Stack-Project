import { Decoration } from './decoration';

export class Tree extends Decoration {

    private static readonly BASE_PATH = 'assets/racing/decoration/oak_tree/';

    private static readonly PART_NAMES: string[] = [
        'oak_green1_leaves', 'oak_green2_leaves', 'oak_trunk'
    ];

    public static readonly WAIT_TO_LOAD = Decoration.loader.loadAll(Tree.BASE_PATH, Tree.PART_NAMES);

    constructor() {
        super();
        this.waitToChildrenAddedInternal = Tree.WAIT_TO_LOAD.then(parts => this.addParts(parts));
    }

}

