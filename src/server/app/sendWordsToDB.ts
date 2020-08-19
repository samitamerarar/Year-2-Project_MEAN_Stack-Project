import { MongoClient, MongoError, Db, Collection } from 'mongodb';
import * as fs from 'fs';
import * as readline from 'readline';

const USERNAME = 'LOG2990-01';
const PASSWORD = new Buffer('YXcyN0pNNjM', 'base64').toString('ascii');
const DATABASE_NAME = 'LOG2990-01-db';

const ENGLISH_WORDS_FILE = './assets/crossword/lexic/englishWords.txt';
const DB_URL = `mongodb://${USERNAME}:${PASSWORD}@parapluie.info.polymtl.ca:27017/${DATABASE_NAME}`;
const LEXIC_WORDS_COLLECTION = 'crossword-lexic-words';

let db: Db;

let forced = false;
// Argument parsing
for (let i = 2; i < process.argv.length; ++i) {
    if (process.argv[i].search(/_force/i) >= 0) {
        forced = true;
    }
}

console.log('Opening english words\' file...');
const WORDS_FILE = fs.openSync(ENGLISH_WORDS_FILE, 'r');
console.log(`Done (fd: ${WORDS_FILE})`);

function exitIfError(error: Error) {
    if (error) {
        console.error(error);
        try {
            fs.closeSync(WORDS_FILE);
            if (db !== undefined) {
                db.close();
            }
        } catch (e) {
            console.error(e);
        }
        process.exit(1);
    }
}

function safeExit() {
    try {
        db.close();
    } catch (e) {
        console.error(e);
    }
    try {
        fs.closeSync(WORDS_FILE);
    } catch (e) {
        console.error(e);
    }
    console.log('\nThank you');
    process.exit(0);
}

console.log('Attempting connection with MongoDB server...');
MongoClient.connect(DB_URL, (error: MongoError, dbParameter: Db) => {
    exitIfError(error);
    console.log('Connection successful');
    db = dbParameter;

    console.log('Fetching lexic-words\'s collection...');
    db.collection(LEXIC_WORDS_COLLECTION, (collectionError, collection: Collection) => {
        exitIfError(collectionError);
        console.log('Done');

        fs.readFile(WORDS_FILE, (fileError: NodeJS.ErrnoException, data: Buffer) => {
            exitIfError(fileError);

            const WORDS: string[] = data.toString().split(/\s+/i);

            const WORDS_COUNT = WORDS.length;
            async function insertWordIfNotPresent() {
                const WORD: string = WORDS.shift();
                const VALUE_IN_DB = (await collection.findOne({ _id: WORD }).then((value: any) => {
                    if (!value) {
                        throw new Error('Value not found');
                    }
                    return value;
                }).then((value) => {
                    if (!value.value || !value.frequency) {
                        return collection.updateOne({ _id: WORD },
                            { _id: WORD, value: WORD, frequency: value.frequency || null })
                            .catch(exitIfError);
                    }
                    return Promise.resolve(<any>{});
                }, (e) => {
                    console.log('Inserting "' + WORD + '" ...');
                    return collection.insertOne({ _id: WORD, value: WORD, frequency: null }).catch(exitIfError);
                }));
                if (!VALUE_IN_DB) {
                    console.log(WORD, 'couldn\'t be placed in the DataBase');
                }
                if (WORDS.length > 0) {
                    // Update progression
                    readline.clearLine(process.stdout, 0);
                    readline.cursorTo(process.stdout, 0);
                    const PROGRESSION: number = Math.floor((WORDS_COUNT - WORDS.length) / WORDS_COUNT * 100);
                    process.stdout.write(PROGRESSION + '% ' + WORDS[0]);
                    readline.cursorTo(process.stdout, 0);
                    // Check next word
                    await insertWordIfNotPresent();
                } else {
                    console.log('Done passing through words');
                    safeExit();
                }
            }

            collection.findOne({ _id: WORDS[0] })
                .then((doc: any) => {
                    const IS_FIRST_WORD_IN_DB: boolean = Boolean(doc);
                    if (!IS_FIRST_WORD_IN_DB || forced) {
                        console.log('Passing through words...');
                        insertWordIfNotPresent();
                    } else {
                        safeExit();
                    }
                });
        });
    });
});
