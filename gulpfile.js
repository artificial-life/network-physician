var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var watch = require('gulp-watch');
var server = require('gulp-develop-server');
var livereload = require('gulp-livereload');
var changed = require('gulp-changed');

var options = {
    path: './build/example.js',
    execArgv: ['--harmony']
};


gulp.task('server:start', ['es6'], function () {
    server.listen(options, livereload.listen);
});

gulp.task("default", function () {
    return gulp.src("src/**/*.js")
        .pipe(babel({
            blacklist: ['bluebirdCoroutines', 'regenerator']
        }))
        .pipe(gulp.dest("build")).on('end', function () {
            require('./build/example.js');
            setTimeout(function () {
                console.log('timeout');
                process.exit()
            }, 30000);
        });
});

gulp.task('es6', function () {
    return gulp.src("src/**/*.js")
        .pipe(babel({
            blacklist: ['bluebirdCoroutines', 'regenerator']
        }))
        .pipe(gulp.dest("build"));
});



gulp.task("sm", function () {
    return gulp.src("src/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel({
            blacklist: ['bluebirdCoroutines', 'regenerator']
        }))
        .pipe(sourcemaps.write("./maps"))
        .pipe(gulp.dest("build"));
});

gulp.task('serve', ['server:start'], function () {

    gulp.watch('src/**/*.js', ['es6-ll']);
});

gulp.task('es6-ll', function () {
    return gulp.src("src/**/*.js")
        .pipe(changed("build"))
        .pipe(babel({
            blacklist: ['bluebirdCoroutines', 'regenerator']
        }))
        .pipe(gulp.dest("build"))
        .on('end', function () {
            server.restart();
        });
});