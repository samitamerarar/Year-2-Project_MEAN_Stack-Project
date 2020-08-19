// Load `*.js` under current directory as properties
//  i.e., `User.js` will become `exports['User']` or `exports.User`
import * as fs from 'fs';
fs.readdirSync(__dirname + '/').forEach(function (file: string) {
    if (file.match(/\.js$/) && !file.match(/\.spec\.js$/) && file !== 'index.js') {
        const NAME = file.replace('.js', '');
        exports[NAME] = require('./' + file);
    }
});
