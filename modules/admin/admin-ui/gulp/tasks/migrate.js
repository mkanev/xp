/*
 Migrate from TS modules .
 */

var CONFIG = require("../config");
var gulp = require("gulp");
var gulpSequence = require("gulp-sequence");
var insert = require("gulp-insert");
var replace = require('gulp-replace');
var vinylFile = require('gulp-file');
var del = require("del");
var path = require("path");
var _ = require("lodash");
var logger = require("../util/compileLogger");

function resolvePath(filePath) {
    return path.join(CONFIG.root.src, filePath);
}

function resolveRelativePath(filePath, baseDirPath) {
    var relativePath = path.relative(path.dirname(filePath), baseDirPath);
    return relativePath ? path.normalize(relativePath).replace(/\\/g, '/') : '.';
}

// Can match 2 alternatives, like (regex1|regex2)
function findAll(regex, content) {
    var match;
    var result = [];

    while ((match = regex.exec(content)) !== null) {
        // var optimizedMatch =  _.compact(match.slice(1));
        var optimizedMatch = match.slice(1).filter(function (value) {
            return value != null;
        });
        result.push(optimizedMatch.length > 1 ? optimizedMatch : optimizedMatch[0]);
    }

    return result;
}

function findExports(content) {
    var exportDefinition = /(?:[\s\n]*export\s+(?:class|interface|enum)\s+)([A-Z]\w+)|(?:[\s\n]*export\s+(?:function)\s*)(\w+)/g;
    return findAll(exportDefinition, content);
}

function findModules(content) {
    var modulePattern = /(?:module\s+)([A-Za-z0-9\.]+)(?:\s*\{\s*\n*)/g;
    return findAll(modulePattern, content);
}

function findModulesUsage(content) {
    // (api\.(?:[a-z0-9]+\.)*[A-Z]\w+)      // api.module.Class
    // (api\.(?:[a-z0-9]+\.)*[a-z]\w+)(\()  // api.module.func()
    // (api\.(?:[a-z0-9]+\.)*[A-Z]\w+)|(api\.(?:[a-z0-9]+\.)*[a-z]\w+)(?:\() // both
    var moduleUsagePattern = /(api\.(?:[a-z0-9]+\.)*[A-Z]\w+)|(api\.(?:[a-z0-9]+\.)*[a-z]\w+)(?:\()/g;
    return findAll(moduleUsagePattern, content);
}

function findImports(content) {
    var importPattern = /import\s+(\w+)\s*=\s*(api.[\w\.]+);?\s*\n*/g;
    return findAll(importPattern, content);
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
    // importAs: NewName
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
var step3tasks = [
    {name: 'common', src: '/common/js/**/*.ts', base: '/common/js/', isCommon: true},
    {name: 'content', src: '/apps/content-studio/js/**/*.ts', base: '/apps/content-studio/js/'},
    {name: 'user', src: '/apps/user-manager/js/**/*.ts', base: '/apps/user-manager/js/'},
    {name: 'applications', src: '/apps/applications/js/**/*.ts', base: '/apps/applications/js/'},
    {name: 'live', src: '/live-edit/js/LiveEditPage.ts', base: '/live-edit/js/'}
];

step3tasks.forEach(function (value) {
    gulp.task('migrate:3_' + value.name, ['migrate:2'], function (cb) {
        var src = resolvePath(value.src);
        var base = resolvePath(value.base);

        return createModuleMigrationStream([src, '!*.d.ts'], base, value.isCommon);
    });
});

function createModuleMigrationStream(src, base, isCommon) {
    isCommon = isCommon || false;

    var regex = {
        lastBracket: /}[\s*\n]*$/g,
        moduleDefinition: /module\s+[A-Za-z0-9\.]*\s+\{\s*\n*/g,
        importDefinition: /(import\s+\w+\s*=\s*[\w\.]+;\s*\n*)/g,
        importApi: /(import\s+["'].*api\.ts["'];\s*\n*)/g,
        moduleUsage: /(?!api\.ts)(api\.(?:[a-z0-9_]+\.)*)/g
    };

    var files = new Map();

    var stream = gulp.src(src, {base: base});

    // Remove `api.ts` imports. Common modules don't have them.
    if (!isCommon) {
        stream = stream.pipe(replace(regex.importApi, ''));
    }

    // Module Definitions or Imports
    // Save all module definitions to the import list
    // Module definitions may have different names from the exports
    stream = stream.pipe(insert.transform(function (contents, file) {
        var data = {imports: []};
        files.set(file.path, data);

        // find module usage
        var importsDefinitions = _.uniq(findImports(contents));
        importsDefinitions.forEach(function (value) {
            var find = findPathByModule(pathsList, value[1]);
            if (!find) {
                var color = 'red';
                logger.log('Module definition: Can\'t resolve module: ' + value[1] + '\n' + file.path, color);
            } else {
                var shallow = _.clone(find);
                if (value[0] !== find.name) {
                    shallow.importAs = value[0];
                }
                data.imports.push(shallow);
            }
        });

        return contents;
    }));

    // Module Usage
    // Save all unique module usage to the import list
    stream = stream.pipe(insert.transform(function (contents, file) {
        var data = files.get(file.path);

        // find module usage
        var modulesUsage = _.uniq(findModulesUsage(contents));
        modulesUsage.forEach(function (value) {
            var find = findPathByModule(pathsList, value);
            if (!find) {
                var color = 'red';
                logger.log('Module usage: Can\'t resolve module: ' + value + '\n' + file.path, color);
            } else {
                data.imports.push(find);
            }
        });

        return contents;
    }));

    // Save potential imports from the same module to the import list
    // Non-common TS already have them imported.
    if (isCommon) {
        stream = stream.pipe(insert.transform(function (contents, file) {
            var data = files.get(file.path);

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

            return contents;
        }))
        // Also, remove the module definition with the last bracket
            .pipe(replace(regex.moduleDefinition, ''))
            .pipe(replace(regex.lastBracket, ''));
    }

    // Remove the imports definition and module usage
    return stream.pipe(replace(regex.importDefinition, ''))
        .pipe(replace(regex.moduleUsage, ''))
        // Add removed imports in their valid definitions
        .pipe(insert.transform(function (contents, file) {
            var importList = [];
            var importApi = 'import "' + resolveRelativePath(file.path, base) + '/api.ts";\n';
            importList.push(importApi);

            var data = files.get(file.path);
            data.imports = _.uniqWith(data.imports, function (value, other) {
                return value.full === other.full;
            });
            data.imports = data.imports.filter(function (value) {
                return value.path !== file.path;
            });
            data.imports.forEach(function (value) {
                var relativePath = resolveRelativePath(file.path, path.dirname(value.path));
                var baseName = path.basename(value.path, '.ts');
                var importName = !value.importAs ? value.name : value.name + ' as ' + value.importAs;
                importList.push('import {' + importName + '} from "' + relativePath + '/' + baseName + '";');
            });

            return importList.join('\n') + '\n\n' + contents;
        }))
        // write files
        .pipe(gulp.dest(base));
}

gulp.task('migrate:3_common_files', function () {
    var apiTs = "///<reference path='./_all.d.ts' />";
    var dest = resolvePath('/common/js/');

    return vinylFile('api.ts', apiTs, {src: true})
        .pipe(gulp.dest(dest));
});

var step3tasksNames = step3tasks.map(function (value) {
    return 'migrate:3_' + value.name;
});
step3tasksNames.push('migrate:3_common_files');

gulp.task('migrate', gulpSequence('migrate:1', step3tasksNames));
