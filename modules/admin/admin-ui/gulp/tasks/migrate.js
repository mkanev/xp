/*
 Migrate from TS modules .
 */

var CONFIG = require("../config");
var gulp = require("gulp");
var gulpSequence = require("gulp-sequence");
var insert = require("gulp-insert");
var replace = require('gulp-replace');
var del = require("del");
var path = require("path");
var _ = require("lodash");
var logger = require("../util/compileLogger");

function resolvePath(filePath) {
    return path.join(CONFIG.root.src, filePath);
}

function findAll(regex, content) {
    var match;
    var result = [];

    while ((match = regex.exec(content)) !== null) {
        result.push(match[1]);
    }

    return result;
}

function findExports(content) {
    var exportDefinition = /(?:[\s\n]*export\s+(?:class|interface)\s+)([A-Z]{1}\w+)/g;
    return findAll(exportDefinition, content);
}

function findModules(content) {
    var modulePattern = /(?:module\s+)([A-Za-z\.]+)(?:\s+\{\s*\n*)/g;
    return findAll(modulePattern, content);
}

function findModulesUsage(content) {
    var moduleUsagePattern = /(api\.(?:[a-z0-9]+\.)*\w+)/g;
    return findAll(moduleUsagePattern, content);
}

function filterRelativeExports(paths, moduleName) {
    return paths.filter(function (value) {
        return value.module === moduleName;
    });
}

function findPathByModule(paths, fullModuleName) {
    return paths.find(function (value) {
        return value.full === fullModuleName;
    });
}

// Shared across the tasks list of TS files
var pathsList = [
    // name: Name
    // module: api.dom
    // full: api.dom.Name
    // path: d:/../js/dom/Name.ts
];

// Step 1
// remove _module.ts
gulp.task('migrate:1', function (cb) {
    var src = resolvePath('/common/js/**/_module.ts');

    return del(src)
        .catch(function (e) {
            logger.pipeError(cb, e);
        }).then(function (files) {
            logger.log("Cleaned " + (files && files.length || 0) + " file(s).");
        });
});

// Step 2
// Create a map for each export
gulp.task('migrate:2', function (cb) {
    var src = resolvePath('/common/js/**/*.ts');
    var base = resolvePath('/common/js/');

    return gulp.src(src, {base: base})
        .pipe(insert.transform(function (contents, file) {
            var module = findModules(contents)[0];
            if (module) {
                var exports = findExports(contents);
                exports.forEach(function (value) {
                    pathsList.push({
                        name: value,
                        module: module,
                        full: module + '.' + value,
                        path: file.path
                    });
                });
            }

            return contents;
        }));
});

// Step 3
// remove module declaration and add api.ts imports
gulp.task('migrate:3', ['migrate:2'], function (cb) {
    // var src = resolvePath('/common/js/ObjectHelper.ts'); // test
    // var src = resolvePath('/apps/content-studio/js/app/ContentAppPanel.ts'); // test
    var src = resolvePath('/common/js/**/*.ts');
    var base = resolvePath('/common/js/');

    var regex = {
        lastBracket: /}[\s*\n]*$/g,
        moduleDefinition: /module\s+[A-Za-z\.]*\s+\{\s*\n*/g,
        importDefinition: /(import\s+\w+\s*=\s*[\w\.]+;\s*\n*)/g,
        moduleUsage: /api\.([a-z0-9_]+\.)*/g
    };

    var files = new Map();

    return gulp.src(src, {base: base})
    // Save potential imports from the same module
        .pipe(insert.transform(function (contents, file) {
            var data = {imports: []};
            files.set(file.path, data);

            // Get file module and search for the non-imported classes
            // from the same module to add the to the import list
            var module = findModules(contents)[0];
            var relativeFiles = filterRelativeExports(pathsList, module);
            relativeFiles.forEach(function (value) {
                var hasModule = contents.search(new RegExp(value.name + '\\W+')) >= 0;
                var isSameFile = value.path === file.path;
                if (hasModule && !isSameFile) {
                    data.imports.push(value);
                }
            });

            // find module usage
            // excluding 'api.ts' definition
            var modulesUsage = _.without(_.uniq(findModulesUsage(contents)), 'api.ts');
            modulesUsage.forEach(function (value) {
                data.imports.push(findPathByModule(pathsList, value));
            });

            // console.log(data.imports);

            return contents;
        }));
    // // Remove module definition and TS style imports.
    // .pipe(replace(regex.moduleDefinition, ''))
    // .pipe(replace(regex.lastBracket, ''))
    // .pipe(replace(regex.importDefinition, ''))
    // .pipe(replace(regex.moduleUsage, ''))
    // //
    // .pipe(insert.transform(function (contents, file) {
    //     var relativePath = path.relative(path.dirname(file.path), basePath);
    //     relativePath = relativePath ? path.normalize(relativePath).replace(/\\/g, '/') : '.';
    //     var importApi = 'import "' + relativePath + '/api.ts";\n\n';
    //     return importApi + contents;
    // }))
    // .pipe(gulp.dest(base));
});


gulp.task('migrate', gulpSequence('migrate:1', 'migrate:3'));
