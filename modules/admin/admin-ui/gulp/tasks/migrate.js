/*
 Migrate from TS modules .
 */

var CONFIG = require("../config");
var gulp = require("gulp");
var del = require("del");
var path = require("path");
var logger = require("../util/compileLogger");

gulp.task('migrate: 1 - remove _module.ts', function (cb) {
    var cleanPaths = path.join(CONFIG.root.src, '/common/js/**/_module.ts');

    return del(cleanPaths)
        .catch(function (e) {
            logger.pipeError(cb, e);
        })
        .then(function (files) {
            logger.log("Cleaned " + (files && files.length || 0) + " file(s).");
        });
});
