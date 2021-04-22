const gulp = require('gulp');
const gulpEslint = require('gulp-eslint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const gulpBabel = require('gulp-babel');
// 同个task下合并多个步骤
const mergeStream = require('merge-stream');
// jsboot
const jsboot = require('./js/jsboot.js');
const cssboot = require('./js/cssboot.js');

// eslint代码检查打包文件以外的文件
gulp.task('eslint_others', () => gulp.src([
        'js/**/*.js',
        'pages/**/*.js',
    ])
    .pipe(gulpEslint())
    .pipe(gulpEslint.format()));

// 合并comdto
gulp.task('comdto_concat', () => gulp.src([
        './js/comdto/mcontrol.js',
        './js/comdto/epointm.js'
    ])
    .pipe(concat('comdto.js'))
    .pipe(gulp.dest('./js/comdto/')));

// 压缩comdto
gulp.task('comdto_uglify', ['comdto_concat'], () => gulp.src(
        './js/comdto/comdto.js'
    )
    .pipe(uglify())
    // 压缩时进行异常捕获
    .on('error', (err) => {
        console.log('line number: %d, message: %s', err.lineNumber, err.message);
        this.end();
    })
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./js/comdto/')));

// 压缩utils
gulp.task('utils_uglify', () => gulp.src([
        './js/utils/*.js',
        '!./js/utils/*.min.js'
    ])
    .pipe(uglify())
    // 压缩时进行异常捕获
    .on('error', (err) => {
        console.log('line number: %d, message: %s', err.lineNumber, err.message);
        this.end();
    })
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./js/utils/')));

// 压缩widgets js
gulp.task('widgets_uglify', () => gulp.src([
        './js/widgets/*/*.js',
        '!./js/widgets/*/*.min.js'
    ])
    .pipe(uglify())
    // 压缩时进行异常捕获
    .on('error', (err) => {
        console.log('line number: %d, message: %s', err.lineNumber, err.message);
        this.end();
    })
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./js/widgets/')));

// 压缩widgets css
gulp.task('widgets_clean_css', () => gulp.src([
        './js/widgets/*/*.css',
        '!./js/widgets/*/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./js/widgets/')));

// 合并压缩 mui\mui.js、common.js、ejs/v2/epoint.moapi.v2.js 到 _dist/core.v2.min.js
gulp.task('core_uglify', () => {
    const paths = jsboot.paths;
    const createPathArr = jsboot.createPathArr;

    /**
     * @description 将gulpfile生成task抽取成函数
     * @param {Number} env 环境
     * @param {Number} ejsVer ejs版本
     * @return {Object} 返回gulp流
     */
    const taskCoreJs = function taskCoreJs(ejsVer, env) {
        let finalPath = createPathArr(paths, ejsVer, env);

        // 将jsboot的路径转为gulp的路径形式
        finalPath = finalPath.map((item) => ('./' + item));

        return gulp.src(finalPath)
            .pipe(concat('core.v' + ejsVer + '.' + env + '.js'))
            .pipe(uglify())
            // 压缩时进行异常捕获
            .on('error', (err) => {
                console.log('line number: %d, message: %s', err.lineNumber, err.message);
                this.end();
            })
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('./js/_dist/'));
    };

    const createTasks = function createTasks(ver) {
        const args = [];

        args.push(taskCoreJs(ver, 'ejs'));
        args.push(taskCoreJs(ver, 'h5'));
        args.push(taskCoreJs(ver, 'dd'));
        args.push(taskCoreJs(ver, 'ejs_h5'));
        args.push(taskCoreJs(ver, 'dd_h5'));
        args.push(taskCoreJs(ver, 'ejs_dd_h5'));

        return args;
    };

    let args = [];

    args = args.concat(createTasks(2)).concat(createTasks(3));

    return mergeStream.apply(null, args);
});

// 压缩core css
gulp.task('core_clean_css', () => {
    var paths = cssboot.paths;

    // 将jsboot的路径转为gulp的路径形式
    paths = paths.map((item) => ('./' + item));

    return gulp.src(paths)
        .pipe(concat('core.css'))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./js/_dist/'));
});

// 压缩core 资源,目前为打包.ttf
gulp.task('core_resource_muittf', () => gulp.src([
        './js/mui/**/*.ttf'
    ])
    .pipe(gulp.dest('./js/_dist/')));

// 压缩pages js
gulp.task('pages_uglify', () => gulp.src([
        './pages/**/*.js',
        '!./pages/**/*.min.js'
    ])
    .pipe(gulpBabel())
    .pipe(uglify())
    // 压缩时进行异常捕获
    .on('error', (err) => {
        console.log('line number: %d, message: %s', err.lineNumber, err.message);
        this.end();
    })
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./pages/')));

// 压缩pages css
gulp.task('pages_clean_css', () => gulp.src([
        './pages/**/*.css',
        '!./pages/**/*.min.css'
    ])
    .pipe(cleanCSS())
    .pipe(rename({
        suffix: '.min'
    }))
    .pipe(gulp.dest('./pages/')));

gulp.task('comdto', ['comdto_concat', 'comdto_uglify']);

gulp.task('widgets', ['widgets_uglify', 'widgets_clean_css']);

gulp.task('pages', ['pages_uglify', 'pages_clean_css']);

gulp.task('core', ['core_uglify', 'core_clean_css', 'core_resource_muittf']);

gulp.task('default', ['comdto', 'utils_uglify', 'widgets', 'core', 'pages']);

gulp.task('watch', () => {
    gulp.watch([
        'js/**/*.js',
        'pages/**/*.js',
        // 避免压缩文件影响
        '!**/*.min.js',
    ], ['default']);
});