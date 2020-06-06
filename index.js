require = require("esm")(module/*, options*/)

var argv = require('minimist')(process.argv.slice(2));

require('./worker.js')(argv);
