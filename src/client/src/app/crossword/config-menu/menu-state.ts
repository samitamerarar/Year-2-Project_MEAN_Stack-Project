import { Subject } from 'rxjs/Subject';

export interface Option {
    name: string;
    nextState: MenuState;
    value?: any;
}

export class MenuState {

    public static readonly none = new MenuState(null, null, [], null);

    private nameInternal: string;
    private fieldNameInternal: string;
    private optionsInternal: Option[];
    private arriveInternal = new Subject<void>();
    private leaveInternal = new Subject<void>();

    public canMoveToNextState: () => boolean;

    constructor(name: string = '',
                fieldName: string = '',
                options: Option[] = [],
                canMoveToNextState = () => true) {
        this.nameInternal = name;
        this.fieldNameInternal = fieldName;
        this.optionsInternal = options.slice();
        this.canMoveToNextState = canMoveToNextState;
    }

    public get name(): string {
        return this.nameInternal;
    }

    public get fieldName(): string {
        return this.fieldNameInternal;
    }

    public get options(): Option[] {
        return this.optionsInternal.slice();
    }

    public get arrive(): Subject<void> {
        return this.arriveInternal;
    }

    public get leave(): Subject<void> {
        return this.leaveInternal;
    }

    public addOption(option: Option): void {
        this.optionsInternal.push(option);
    }

}
