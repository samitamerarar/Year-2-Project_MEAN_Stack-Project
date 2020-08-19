export class PacketEvent<T> {
    constructor(public readonly value: T, public readonly socketid: string) { }
}
