'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');
var open = require('gulp-open');
var concat = require('gulp-concat');
var lint = require('gulp-eslint');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

var config = {
    port: 9000,
    devBaseUrl: 'http://localhost',
    paths: {
        html: './src/*.html',
        js: './src/**/*.jsx',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/boostrap-theme.min.css',
            './src/css/**/*.css'
        ],
        fonts: [
            'node_modules/bootstrap/dist/fonts/glyphicons*'
        ],
        img: './src/img/**/*',
        dist: './build',
        mainJs: './src/main.jsx'
    }
};

// Start a local dev server
gulp.task('connect', function() {
    connect.server({
        root: ['build'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

// open up index in web browser
gulp.task('open', ['connect'], function() {
    gulp.src('./build/index.html')
        .pipe(open({ uri: config.devBaseUrl + ':' + config.port + '/'}));
});

// copy over html to build
gulp.task('html', function() {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js', function() {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + '/scripts'))
        .pipe(connect.reload());
});

gulp.task('css', function() {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'))
        .pipe(connect.reload());
});

gulp.task('fonts', function() {
    gulp.src(config.paths.fonts)
        .pipe(gulp.dest(config.paths.dist + '/fonts'))
        .pipe(connect.reload());
});

gulp.task('img', function() {
    gulp.src(config.paths.img)
        .pipe(gulp.dest(config.paths.dist + '/img'))
        .pipe(connect.reload());
});

gulp.task('lint', function() {
    return gulp.src(config.paths.js)
        .pipe(lint({config: 'eslint.config.json'}))
        .pipe(lint.format())
        .pipe(lint.failOnError());
});

gulp.task('watch', function() {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js', 'lint']);
    gulp.watch('./src/css/**/*.css', ['css']);
});

// default task for convenience
gulp.task('default', ['html', 'js', 'css', 'fonts', 'img', 'lint', 'open', 'watch']);
