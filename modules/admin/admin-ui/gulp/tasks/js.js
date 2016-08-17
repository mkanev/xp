/*
 Compile TypeScript and create modules.
 TSC + Gulp for old modules, webpack for new ones.
 */

var CONFIG = require("../config");
var gulp = require("gulp");
var gulpSequence = require("gulp-sequence");
var _ = require("lodash");
var tsc = require("gulp-typescript");
var typescript = require("typescript");
var sourcemaps = require("gulp-sourcemaps");
var newer = require("gulp-newer");
var webpack = require("webpack");
var assign = require("deep-assign");
var newerStream = require("../util/newerStream");
var nameResolver = require("../util/nameResolver");
var pathResolver = require("../util/pathResolver");
var webpackConfig = require("../util/webpackConfig");
var logger = require("../util/compileLogger");

var subtasks = CONFIG.tasks.js.files;

function filterTasks(tasks, callback) {
    const filtered = {};

    _.forOwn(tasks, function (task, name) {
        if (callback(task)) {
            filtered[name] = task;
        }
    });

    return filtered;
}

/*
 Modules processed with webpack.
 js:common
 js:live
 js:home
 js:launcher
 js:applications
 js:content
 js:user
 */
var webpackTasks = filterTasks(subtasks, function (task) {
    return !!task.name;
});

gulp.task('js', function (cb) {
    webpack(webpackConfig(webpackTasks), function (err, stats) {
        logger.logWebpack(err, stats);
        cb();
    });
});
