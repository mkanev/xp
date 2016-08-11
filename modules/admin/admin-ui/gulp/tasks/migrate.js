/*
 Migrate from TS modules .
 */

var CONFIG = require("../config");
var gulp = require("gulp");
var del = require("del");
var path = require("path");
var replace = require('gulp-replace');
var insert = require("gulp-insert");
var logger = require("../util/compileLogger");

function resolvePath(filePath) {
    return path.join(CONFIG.root.src, filePath);
}

function resolvePaths(filePaths) {
    filePaths = filePaths || [];
    return filePaths.map(resolvePath);
}

// Step 1
// remove _module.ts
gulp.task('migrate:1', function (cb) {
    var cleanPaths = resolvePath('/common/js/**/_module.ts');

    return del(cleanPaths)
        .catch(function (e) {
            logger.pipeError(cb, e);
        })
        .then(function (files) {
            logger.log("Cleaned " + (files && files.length || 0) + " file(s).");
        });
});

// Step 2
// remove module declaration
gulp.task('migrate:2', function (cb) {
    var tsPaths = resolvePath('/common/js/**/*.ts');
    // var tsPaths = resolvePath('/common/js/ui/button/Button.ts');
    // var tsPaths = resolvePath('/common/js/Class.ts');
    var basePath = resolvePath('/common/js/');

    var bracketPattern = /}[\s*\n]*$/g;
    var modulePattern = /module\s+[A-Za-z\.]*\s+\{\s*\n*/g;

    return gulp.src(tsPaths, {base: basePath})
        .pipe(replace(modulePattern, ''))
        .pipe(replace(bracketPattern, ''))
        .pipe(insert.transform(function (contents, file) {
            var relativePath = path.relative(path.dirname(file.path), basePath);
            relativePath = relativePath ? path.normalize(relativePath).replace(/\\/g, '/') : '.';
            var importApi = 'import "' + relativePath + '/api.ts";\n\n';
            return importApi + contents;
        }))
        .pipe(gulp.dest(basePath));
});
