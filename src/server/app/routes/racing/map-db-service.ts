import { Db, Collection, MongoError, FindAndModifyWriteOpResultObject } from 'mongodb';

import { SerializedMap } from '../../../../common/src/racing/serialized-map';
import { HttpStatus } from '../../../../common/src';
import { SerializedBestTime } from '../../../../common/src/racing/serialized-best-time';
import { SerializedPlayer } from '../../../../common/src/racing/serialized-player';

export class MapDbService {

    public static readonly COLLECTION = 'racing-maps';
    public static readonly VALID_MAP_NAMES_MATCHER = /^\S.*\S?$/i;

    public mapCollection: Collection;

    constructor(private dbPromise: Promise<Db>) {
        dbPromise.then((db: Db) => {
            db.collection(MapDbService.COLLECTION, (error: MongoError, mapCollection: Collection<any>) => {
                this.mapCollection = mapCollection;
            });
        });
    }

    public saveNew(serializedMap: SerializedMap): Promise<void> {
        return new Promise((resolve, reject) => {
            serializedMap.name = serializedMap.name.trim();
            if (serializedMap.name == null ||
                !MapDbService.VALID_MAP_NAMES_MATCHER.test(serializedMap.name)) {
                reject(HttpStatus.BAD_REQUEST);
                return;
            }

            const MAP_DOCUMENT: any = this.makeMapDocumentFrom(serializedMap);
            this.mapCollection.insertOne(MAP_DOCUMENT)
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject(HttpStatus.CONFLICT);
            });
        });
    }

    public saveEdited(serializedMap: SerializedMap): Promise<void> {
        return new Promise((resolve, reject) => {
            if (serializedMap.name == null) {
                reject(HttpStatus.BAD_REQUEST);
                return;
            }

            const MAP_DOCUMENT: any = this.makeMapDocumentFrom(serializedMap);

            this.mapCollection.findOneAndReplace({_id: MAP_DOCUMENT._id}, MAP_DOCUMENT)
            .then((result: FindAndModifyWriteOpResultObject) => {
                if (result.value) {
                    resolve();
                }
                else {
                    reject(HttpStatus.NOT_FOUND);
                }
            })
            .catch(() => {
                reject(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    }

    public delete(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.mapCollection.findOneAndDelete({name: name})
            .then((result: FindAndModifyWriteOpResultObject) => {
                if (result.value) {
                    resolve();
                }
                else {
                    reject(HttpStatus.NOT_FOUND);
                }
            })
            .catch((reason) => {
                reject(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    }

    public getMapNames(count: number): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.mapCollection.find({}, {_id: false, name: true}).toArray()
            .then((nameObjects: any[]) => {
                const NAMES: string[] = nameObjects.map((nameObject: any) => nameObject.name);
                if (NAMES.length > count) {
                    NAMES.splice(count);
                }
                resolve(NAMES);
            })
            .catch(() => {
                reject(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    }

    public getByName(name: string): Promise<SerializedMap> {
        return this.getMapProperties(name, {_id: false})
            .then(mapDocument => this.makeSerializedMapFrom(mapDocument));
    }

    public getMapProperties(name: string, properties: Object): Promise<Object> {
        return new Promise((resolve, reject) => {
            this.mapCollection.findOne({name: name}, {fields: properties})
            .then((mapFields: any) => {
                if (mapFields) {
                    resolve(mapFields);
                }
                else {
                    reject(HttpStatus.NOT_FOUND);
                }
            })
            .catch(() => {
                reject(HttpStatus.INTERNAL_SERVER_ERROR);
            });
        });
    }

    public setMapProperties(name: string, properties: Object): Promise<void> {
        return this.mapCollection.findOneAndUpdate({name: name}, {$set: properties}, {projection: {_id: true}})
            .then((result) => { return; });
    }

    private makeMapDocumentFrom(serializedMap: SerializedMap): any {
        const MAP_DOCUMENT: any = serializedMap;
        MAP_DOCUMENT._id = serializedMap.name;
        return MAP_DOCUMENT;
    }

    private makeSerializedMapFrom(mapDocument: any): SerializedMap {
        // tslint:disable-next-line:no-unused-variable
        const {_id: ID, ...SERIALIZED_MAP} = mapDocument;

        if (SERIALIZED_MAP.bestTimes.length > 0 && typeof SERIALIZED_MAP.bestTimes[0] === 'number') {
            // Map was generated by old code. Convert bestTimes to new type.
            SERIALIZED_MAP.bestTimes =
                SERIALIZED_MAP.bestTimes.map(
                    (bestTime: number) => new SerializedBestTime(new SerializedPlayer('DEFAULT_PLAYER_NAME'), bestTime)
                );
        }

        return SERIALIZED_MAP;
    }

}
