import { Decoration } from './decoration';

export class Bush extends Decoration {

    private static readonly BASE_PATH = 'assets/racing/decoration/fir_bush/';

    private static readonly PART_NAMES: string[] = [
        'fir_trunk', 'fir_leaves'
    ];

    public static readonly WAIT_TO_LOAD = Decoration.loader.loadAll(Bush.BASE_PATH, Bush.PART_NAMES);

    constructor() {
        super();
        this.waitToChildrenAddedInternal = Bush.WAIT_TO_LOAD.then(parts => this.addParts(parts));
    }
}
