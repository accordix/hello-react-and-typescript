'use strict';

var gulp = require('gulp');
var GulpConfig = require('./gulpconfig');
var combiner = require('stream-combiner2');
var connect = require('gulp-connect');
var browserify = require('browserify');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var tsc = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var tsProject = tsc.createProject('tsconfig.json', { sortOutput: true });
var del = require('del');

var config = new GulpConfig();
var b = browserify({
  entries: [config.paths.mainJs],
  cache: {},
  packageCache: {},
  plugin: [watchify]
});
b.on('update', bundle);
b.on('log', console.log.bind(console));

gulp.task('clean', function(done){
    del.sync([config.paths.dist + '/**']);
    done();
});

gulp.task('html', function(done){
    combiner.obj([
        gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload())
    ])
    .on('error', console.error.bind(console));
    done();
});

gulp.task('css', function(done){
    del(config.paths.dist + '/css/**/*');

    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + '/css'));
    done();
});

gulp.task('img', function(done){
    del(config.paths.dist + '/images/**/*');

    gulp.src(config.paths.img)
        .pipe(gulp.dest(config.paths.dist + '/images'))
        .pipe(connect.reload());

    gulp.src('./src/favicon.ico')
        .pipe(gulp.dest(config.paths.dist));
    done();
});

gulp.task('typescript', function(done){
    var tsResult = gulp
        .src([config.paths.tsx, config.paths.tsf])
        .pipe(sourcemaps.init())
        .pipe(tsc(tsProject));

    tsResult.js
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.paths.tsjsOut));
    done();
})

gulp.task('lint', function(done){
    gulp
        .src(config.paths.js)
        .pipe(eslint())
        .pipe(eslint.format());
    done();
});

gulp.task('js', function(done){
  bundle();
  done();
});

gulp.task('connect', function(done){
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
    done();
});

gulp.task('watch', function(done){
    browserSync.init({
        server: "./dist",
        port: config.port
    });

    gulp.watch(config.paths.html, gulp.series('html', reload));
    gulp.watch(config.paths.img, gulp.series('img', reload));
    gulp.watch(config.paths.css, gulp.series('css', reload));
    gulp.watch([config.paths.tsx, config.paths.tsf], gulp.series('typescript', 'lint', 'js', reload));
    done();
});

gulp.task('stopit', function(done){
    done();
    process.exit();
});

gulp.task('default', gulp.series('clean', gulp.parallel('html', 'css', 'img'), 'typescript', 'lint', 'js', 'connect', 'watch'));

gulp.task('production', gulp.series('clean', gulp.parallel('html', 'css', 'img'), 'typescript', 'lint', 'js', 'stopit'));

gulp.task('test', function(done){
    done();
});


function bundle() {
    b
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('scripts/bundle.js'))
    .pipe(gulp.dest('./dist'));
}
