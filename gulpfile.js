'use strict';

var gulp = require('gulp'),
	paths = {
		gulp: './gulpfile.js',
		src: './src/**/*.js',
		test: './test/*Spec.js'
	};

gulp.task('default', ['lint', 'test']);

gulp.task('lint', function () {
    var jscs = require('gulp-jscs');
    var jshint = require('gulp-jshint');

    return gulp
        .src([paths.gulp, paths.src, paths.test])
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('cover', function () {
    var istanbul = require('gulp-istanbul');

    return gulp
        .src(paths.src)
        .pipe(istanbul());
});

gulp.task('test', ['cover'], function () {
    var istanbul = require('gulp-istanbul');
    var jasmine = require('gulp-jasmine');

    return gulp
        .src(paths.test)
        .pipe(jasmine({ verbose: true }))
        .pipe(istanbul.writeReports());
});

gulp.task('watch', function () {
	var lr = require('gulp-livereload'),
		watch = require('gulp-watch');

	watch({ glob: [paths.src, paths.test] }).pipe(lr());
});
