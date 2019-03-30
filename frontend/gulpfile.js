const gulp = require('gulp');
const concat = require('gulp-concat');
const nunjucks = require('gulp-nunjucks');
const del = require('del');
const path = require('path');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const runSequence = require('run-sequence');
const concatcss = require('gulp-concat-css');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;

//============= DEBUG ===========

gulp.task('debug-complete', ['debug'], function () {
    runSequence('dependencies-debug', 'minify-html-debug', 'css-debug');
});

gulp.task('debug', function () {
    gulp.src('src/*.html').pipe(gulp.dest('debug'));
    gulp.src('src/*.json').pipe(gulp.dest('debug'));
    gulp.src('src/*.js').pipe(gulp.dest('debug'));
    gulp.src('src/pages/**/*').pipe(gulp.dest('debug/pages'));
    gulp.src('src/menu/**/*').pipe(gulp.dest('debug/menu'));
    gulp.src('src/fonts/*').pipe(gulp.dest('debug/fonts'));
    gulp.src('src/lang/*').pipe(gulp.dest('debug/lang'));
    //gulp.src('src/lib/**/*').pipe(gulp.dest('debug/lib'));
    gulp.src('src/sound/**/*').pipe(gulp.dest('debug/sound'));
    gulp.src('src/img/**/*').pipe(gulp.dest('debug/img'));
    gulp.src('src/reuse/**/*').pipe(gulp.dest('debug/reuse'));
    gulp.src('src/css/*.css').pipe(gulp.dest('debug/css'));
    gulp.src('src/scripts/*.js').pipe(concat('app.js')).pipe(babel({
        presets: ['env']
    })).pipe(gulp.dest('debug/js'));
    gulp.src('src/templates/*.html').pipe(nunjucks.precompile()).pipe(gulp.dest('temp')).pipe(concat('templates.js')).pipe(gulp.dest('debug/'));
});

gulp.task('dependencies-debug', function () {
    gulp.src('src/lib/firebase/**/*').pipe(gulp.dest('debug/lib/firebase'));
    gulp.src('src/lib/webfonts/**/*').pipe(gulp.dest('debug/lib/webfonts'));
    gulp.src('src/lib/framework7/*.js').pipe(gulp.dest('debug/lib/framework7'));
    gulp.src('src/lib/gmaps/*.js').pipe(gulp.dest('debug/lib/gmaps'));
    gulp.src('src/lib/*.js').pipe(concat('libs.js')).pipe(gulp.dest('debug/lib'));
});

gulp.task('minify-html-debug', function () {
    gulp.src('src/*.html').pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS: true
    })).pipe(gulp.dest('debug'));
    gulp.src('src/menu/*.html').pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS: true
    })).pipe(gulp.dest('debug/menu'));
    gulp.src('src/pages/**/*.html').pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS: true
    })).pipe(gulp.dest('debug/pages'));
});

gulp.task('css-debug', function () {
    gulp.src('src/lib/**/*.css').pipe(concatcss('libs.css')).pipe(cleancss({
        compatibility: 'ie8'
    })).pipe(gulp.dest('debug/lib'));
    gulp.src('debug/css/app.css').pipe(cleancss({
        compatibility: 'ie8'
    })).pipe(gulp.dest('debug/css'));
    gulp.src('debug/css/desktop.css').pipe(cleancss({
        compatibility: 'ie8'
    })).pipe(gulp.dest('debug/css'));
});

//=========== END DEBUG =========

//=========== RELEASE ===========

gulp.task('release', ['firebase'], function () {
    runSequence('dependencies-firebase', 'minify-html-firebase', 'css-firebase');
});

gulp.task('firebase', function () {
    gulp.src('src/*.html').pipe(gulp.dest('firebase/public'));
    gulp.src('src/manifest.json').pipe(gulp.dest('firebase/public'));
    gulp.src('src/firebase-messaging-sw.js').pipe(gulp.dest('firebase/public'));
    gulp.src('src/pages/**/*').pipe(gulp.dest('firebase/public/pages'));
    gulp.src('src/menu/**/*').pipe(gulp.dest('firebase/public/menu'));
    gulp.src('src/fonts/*').pipe(gulp.dest('firebase/public/fonts'));
    gulp.src('src/lang/*').pipe(gulp.dest('firebase/public/lang'));
    //gulp.src('src/lib/**/*').pipe(gulp.dest('firebase/public/lib'));
    gulp.src('src/sound/**/*').pipe(gulp.dest('firebase/public/sound'));
    gulp.src('src/img/**/*').pipe(gulp.dest('firebase/public/img'));
    gulp.src('src/reuse/**/*').pipe(gulp.dest('firebase/public/reuse'));
    gulp.src('src/css/*.css').pipe(gulp.dest('firebase/public/css'));
    gulp.src('src/scripts/*.js').pipe(concat('app.js')).pipe(babel({
        presets: ['env']
    })).pipe(gulp.dest('firebase/public/js'));
    gulp.src('src/templates/*.html').pipe(nunjucks.precompile()).pipe(gulp.dest('temp')).pipe(concat('templates.js')).pipe(gulp.dest('firebase/public/'));
});

gulp.task('css-firebase', function () {
    gulp.src('src/lib/**/*.css').pipe(concatcss('libs.css')).pipe(cleancss({
        compatibility: 'ie8'
    })).pipe(gulp.dest('firebase/public/lib'));
    gulp.src('debug/css/app.css').pipe(cleancss({
        compatibility: 'ie8'
    })).pipe(gulp.dest('firebase/public/css'));
    gulp.src('debug/css/desktop.css').pipe(cleancss({
        compatibility: 'ie8'
    })).pipe(gulp.dest('firebase/public/css'));
});

gulp.task('minify-html-firebase', function () {
    gulp.src('src/*.html').pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS: true
    })).pipe(gulp.dest('firebase/public'));
    gulp.src('src/menu/*.html').pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS: true
    })).pipe(gulp.dest('firebase/public/menu'));
    gulp.src('src/pages/**/*.html').pipe(htmlmin({
        collapseWhitespace: true,
        minifyCSS: true
    })).pipe(gulp.dest('firebase/public/pages'));
});

gulp.task('dependencies-firebase', function () {
    gulp.src('src/lib/firebase/**/*').pipe(gulp.dest('firebase/public/lib/firebase'));
    gulp.src('src/lib/webfonts/**/*').pipe(gulp.dest('firebase/public/lib/webfonts'));
    gulp.src('src/lib/framework7/*.js').pipe(gulp.dest('firebase/public/lib/framework7'));
    gulp.src('src/lib/gmaps/*.js').pipe(gulp.dest('firebase/public/lib/gmaps'));
    gulp.src('src/lib/*.js').pipe(concat('libs.js')).pipe(gulp.dest('firebase/public/lib'));
});

//=========== END RELEASE =========

gulp.task('watch', function () {
    gulp.watch('src/**/*', ['debug']).on('change', function (res) {
        if (res.type === 'deleted') {
            var filePathFromSrc = path.relative(path.resolve('src'), res.path);
            var debugFilePath = path.resolve('debug', filePathFromSrc);
            del.sync(debugFilePath);
        }
    });
});