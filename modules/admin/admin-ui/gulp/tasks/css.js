/*
 Compile LESS files, apply autoprefixer and generate sourcemaps.
 */

var CONFIG = require("../config");
var gulp = require("gulp");
var _ = require("lodash");
var less = require("gulp-less");
var AutoPrefixer = require("less-plugin-autoprefix");
var sourcemaps = require("gulp-sourcemaps");
var rename = require("gulp-rename");
var newer = require("gulp-newer");
var path = require("path");
var newerStream = require("../util/newerStream");
var nameResolver = require("../util/nameResolver");
var pathResolver = require("../util/pathResolver");
var logger = require("../util/compileLogger");

var subtasks = CONFIG.tasks.css.files;
var autoprefix = new AutoPrefixer(CONFIG.tasks.css.autoprefixer);

const cssResolver = nameResolver.bind(null, 'css');

/*
 Generate a separate task for each dest of less file:
 css: common
 css: live
 css: home
 css: editor
 css: launcher
 */
_.forOwn(subtasks, function (task, name) {
    var dest = task.assets ? CONFIG.assets.dest : CONFIG.root.dest;
    var taskPath = pathResolver.commonPaths(task.src, task.dest, CONFIG.root.src, CONFIG.root.dest);
    var newerPath = pathResolver.anyPath(taskPath.src.dir);
    var watch = [];
    if (task.watch) {
        watch = task.watch.map(function (el) {
            return pathResolver.anyPath(path.join(CONFIG.root.src, path.dirname(el)));
        });
    }

    gulp.task(cssResolver(name), function (cb) {
        console.log('======');
        console.log(cssResolver(name));
        console.log(taskPath.dest.full);
        console.log(taskPath.src.full);
        console.log('======');
        var cssNewer = gulp.src(pathResolver.flattenPaths([newerPath, watch]))
            .on('error', logger.pipeError.bind(null, cb))
            .pipe(newer(taskPath.dest.full))
            .on('error', logger.pipeError.bind(null, cb))
            .pipe(newerStream(taskPath.src.full))
            .on('error', logger.pipeError.bind(null, cb));

        return cssNewer
            .pipe(sourcemaps.init())
            .on('error', logger.pipeError.bind(null, cb))
            .pipe(less({
                plugins: [autoprefix],
                relativeUrls: true
            }))
            .on('error', logger.pipeError.bind(null, cb))
            .pipe(sourcemaps.write())
            .on('error', logger.pipeError.bind(null, cb))
            .pipe(rename(task.dest))
            .on('error', logger.pipeError.bind(null, cb))
            .pipe(gulp.dest(dest))
            .on('error', logger.pipeError.bind(null, cb));
    });
});

/*
 Main CSS task
 */
gulp.task('css', Object.keys(subtasks).map(cssResolver));
