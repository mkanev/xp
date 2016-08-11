var CONFIG = {
    gulpTasks: 'gulp/tasks/',
    root: {
        src: 'src/main/resources/web/admin',
        dest: 'target/resources/main/web/admin'
    },
    assets: {
        src: 'src/main/resources/assets',
        dest: 'target/resources/main/assets'
    },
    tasks: {
        css: {
            autoprefixer: {
                browsers: ['last 3 versions', 'ie 11']
            },
            maps: {},
            files: {
                common: {src: '/common/styles/_module.less', dest: '/common/styles/_all.css'},
                live: {src: '/live-edit/styles/_module.less', dest: '/live-edit/styles/_all.css'},
                home: {src: '/common/styles/apps/home/home.less', dest: '/common/styles/_home.css'},
                editor: {
                    src: '/common/styles/api/util/htmlarea/html-editor.module.less',
                    dest: '/common/styles/api/util/htmlarea/html-editor.css'
                },
                launcher: {src: '/common/styles/apps/launcher/launcher.less', dest: '/styles/_launcher.css', assets: true}
            }
        },
        directives: {
            src: '/common/lib/_include.js',
            dest: '/common/lib/_all.js'
        },
        clean: {
            pattern: '/**/_all.*',
            cleanDot: true
        },
        js: {
            files: {
                // still processed with gulp
                common: {src: '/common/js/_module.ts', dest: '/common/js/_all.js'},
                // live: {src: '/live-edit/js/_module.ts', dest: '/live-edit/js/_all.js'},
                // webpack
                // default target path is under /apps, but not for common or live-edit
                // common: {src: '/common/js/main.ts', name: 'common'},
                live: {src: '/live-edit/js/main.ts', name: 'live-edit'},
                home: {src: '/js/home/main.js', name: 'apps/home', assets: true},
                launcher: {src: '/js/launcher/main.js', name: 'apps/launcher', assets: true},
                applications: {src: '/apps/applications/js/main.ts', name: 'apps/applications'},
                content: {src: '/apps/content-studio/js/main.ts', name: 'apps/content-studio'},
                user: {src: '/apps/user-manager/js/main.ts', name: 'apps/user-manager'}
            },
            ts: {
                target: 'ES5',
                declaration: true,
                noImplicitAny: false
            },
            webpack: {
                dest: '/[name]/js/_all.js'
            }
        },
        resources: {
            entries: [
                // Example structure
                // Will include `material-design-lite/material.min.js` and others
                // {
                //     dir: 'material-design-lite/',
                //     name: 'material',
                //     ext: ['.min.js', '.min.js.map', '.min.css', '.min.css.map']
                // }
            ],
            dest: 'common/lib/'
        }
    }
};

module.exports = CONFIG;
