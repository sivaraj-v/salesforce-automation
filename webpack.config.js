const TARGET = process.env.npm_lifecycle_event;

if (TARGET === 'dev' || !TARGET) {
    module.exports = require('./webpack.config.dev');
    console.info('--> ./webpack.config.dev.js');
}
if (TARGET === 'prod') {
    module.exports = require('./webpack.config.prod');
    console.info('--> ./webpack.config.prod.js');
}

// https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366