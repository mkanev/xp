var notify = require("gulp-notify");
var gulpUtil = require("gulp-util");
var path = require("path");

module.exports.handleErrors = function (errorObject) {
    var context = this || global;
    notify.onError(errorObject.toString().replace(/:\s{1}/g, ':\n')).apply(context, arguments);

    // Keep gulp from hanging on this task
    if (context && typeof context.emit === 'function') {
        global.emit('end');
    }
};

module.exports.handleWebpackErrors = function (errorObject) {
    var logger = gulpUtil.colors.red;
    var filePath = path.relative(__dirname + '/../..', errorObject.module.userRequest);
    var fileName = path.basename(errorObject.module.userRequest);

    var message = filePath + '\n' + fileName + ' ' + errorObject.message + '\n';
    gulpUtil.log(logger(message));
};
