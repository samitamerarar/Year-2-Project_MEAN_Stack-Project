export class Player {

    public static readonly NO_PLAYER = new Player(null, null);

    private nameInternal: string;
    private socketIdInternal: string;

    public get name(): string {
        return this.nameInternal;
    }

    public get socketId(): string {
        return this.socketIdInternal;
    }

    constructor(name: string, socketId: string) {
        this.nameInternal = name;
        this.socketIdInternal = socketId;
    }

    public equals(that: Player): boolean {
        return this.nameInternal === that.nameInternal &&
               this.socketIdInternal === that.socketIdInternal;
    }

    public clone(): Player {
        return new Player(this.nameInternal, this.socketIdInternal);
    }

}
