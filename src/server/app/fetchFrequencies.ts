import { Db, Cursor } from 'mongodb';
import * as readline from 'readline';

import { provideDatabase } from './app-db';
import { Lexic, WordDocument } from './routes/crossword/lexic';
import { ExternalWordApiService } from './routes/crossword/lexic/external-word-api.service';

const EXTERNAL_API = new ExternalWordApiService();

provideDatabase().then((db: Db) => {
    const wordCollection = db.collection<WordDocument>(Lexic.LEXIC_WORDS_COLLECTION);
    const PROMISES: Promise<void>[] = [];

    const cursor: Cursor<WordDocument> = wordCollection.find({ $or: [{ frequency: null }, { frequency: { $lt: 0 } }] },
        { value: true, frequency: true }, 0, 15000);
    cursor.count().then((wordCount: number, i = 0) => {
        console.log(wordCount + ' word(s) to update');
        cursor.forEach((word: WordDocument) => {
            const UPDATE_CONSOLE = () => {
                readline.clearLine(process.stdout, 0);
                readline.cursorTo(process.stdout, 0);
                process.stdout.write('[' + (i) + '/' + wordCount + '] ' + word.value + ': ' + word.frequency);
                readline.cursorTo(process.stdout, 0);
            };

            const UPDATE_FREQUENCY = (frequency: number) => {
                return wordCollection.updateOne({ _id: word._id }, { $set: { frequency: frequency } })
                    .then((result) => {
                        ++i;
                        UPDATE_CONSOLE();

                        if (result.modifiedCount <= 0) {
                            throw new Error(word.value + ' not updated');
                        }
                    }, (error) => {
                        ++i;
                        UPDATE_CONSOLE();
                        throw error;
                    });
            };

            PROMISES.push(EXTERNAL_API.getFrequency(word.value)
                .then(UPDATE_FREQUENCY, (error) => {
                    readline.clearLine(process.stdout, 0);
                    console.warn(error.message);
                    ++i;
                    UPDATE_CONSOLE();
                    if (word.frequency === null) {
                        UPDATE_FREQUENCY(-1);
                    }
                }));
        }, (error) => {
            if (error) {
                readline.clearLine(process.stdout, 0);
                console.error(error.message);
            }
            Promise.all(PROMISES)
                .then(() => {
                    readline.clearLine(process.stdout, 0);
                    console.log('Done');
                    process.exit(0);
                }).catch(({ message }) => console.error(message));
        });
    });
}).catch(console.error);
