/*
 Copy resources from /node_modules into the resources
 and resolves typings.
 */

var CONFIG = require("../config");
var gulp = require("gulp");
var path = require("path");
var typings = require("gulp-typings");
var pathResolver = require("../util/pathResolver");

function format(name, ext) {
    return path.format({name: name, ext: ext});
}

// The result is an array
function resolvePaths(entry) {
    return entry.ext.map(function (ext) {
        return path.join("node_modules", entry.dir, format(entry.name, ext));
    });
}

gulp.task('resources:modules', function (cb) {
    var src = pathResolver.flattenPaths(CONFIG.tasks.resources.entries.map(resolvePaths));
    var dest = path.join(CONFIG.root.src, CONFIG.tasks.resources.dest);
    return gulp.src(src, {base: "node_modules"})
        .pipe(gulp.dest(dest));
});

gulp.task('resources:typings', function () {
    return gulp.src('typings.json')
        .pipe(typings());
});

gulp.task('resources', ['resources:modules', 'resources:typings']);
