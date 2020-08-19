import { MongoClient, Db, MongoError, Collection } from 'mongodb';
import { Logger } from '../../common/src';

const logger = Logger.getLogger('MongoDB');

const USERNAME = 'LOG2990-01';
const PASSWORD = new Buffer('YXcyN0pNNjM', 'base64').toString('ascii');
const DATABASE_NAME = 'LOG2990-01-db';

const DB_URL = `mongodb://${USERNAME}:${PASSWORD}@parapluie.info.polymtl.ca:27017/${DATABASE_NAME}`;

const DATABASE_PROMISE: Promise<Db> = new Promise<Db>((resolve, reject) => {
    logger.info('Attempting connection with MongoDB server...');
    MongoClient.connect(DB_URL, (connectionError: MongoError, database: Db) => {
        if (connectionError) {
            logger.error('An error occured while connecting to the database:', connectionError);
            reject(connectionError);
        } else {
            logger.log('Connected');
            resolve(database);
        }
    });
});

export function provideDatabase(): Promise<Db> {
    return DATABASE_PROMISE;
}

export function fetchCollection<T = any>(collectionName: string): Promise<Collection<T>> {
    return DATABASE_PROMISE.then((db: Db) => db.collection<T>(collectionName));
}

export function ensureCollectionReady(collectionGetter: () => Collection): Promise<void> {
    // Already resolved ?
    if (collectionGetter()) {
        return new Promise((resolve) => resolve());
    }

    // Not yet resolved
    let intervalId: NodeJS.Timer;
    return new Promise((resolve, reject) => {
        intervalId = setInterval(() => {
            if (collectionGetter()) {
                clearInterval(intervalId);
                resolve();
            }
        }, 100);
    });
}
