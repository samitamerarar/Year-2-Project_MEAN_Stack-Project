export abstract class PacketParser<T> {
    public abstract serialize(value: T): ArrayBuffer;
    public abstract parse(data: ArrayBuffer): T;
}
