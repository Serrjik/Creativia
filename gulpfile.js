var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var del = require('del');

var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

var pug = require('gulp-pug');
var htmlbeautify = require('gulp-html-beautify');

// SVG sprites
var svgmin = require('gulp-svgmin');
var cheerio = require('gulp-cheerio');
var replace = require('gulp-replace');
var svgSprite = require('gulp-svgsprite');
var rename = require('gulp-rename');

// Images
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

// HTML, CSS, JS
var usemin = require('gulp-usemin');
var htmlclean = require('gulp-htmlclean');
var uglify = require('gulp-uglify'); // Сжатие JS
var minifyCss = require('gulp-minify-css'); // Сжатие CSS
var rev = require('gulp-rev');

// Для работы с markdown просто установить через npm jstransformer-markdown-it

gulp.task('server', function() {

	browserSync.init({
		server: {baseDir: './docs/'}
	});

	watch('./src/less/**/*.less', function(){
		gulp.start('styles');
	});

	watch('./src/pug/**/*.pug', function(){
		gulp.start('pug');
	});

	watch('./src/js/**/*.js', function(){
		gulp.start('copy:js');
	});

	watch('./src/libs/**/*.*', function(){
		gulp.start('copy:libs-local');
	});

	watch(['./src/img/**/*.*', '!./src/img/svg-for-sprites/**/*.svg'], function(){
		gulp.start('copy:img');
	});

	watch('./src/img/svg/*.svg', function(){
		gulp.start('svg');
	});

});

gulp.task('styles', function() {
	return gulp.src('./src/less/main.less')
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 6 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./docs/css'))
		.pipe(browserSync.stream());
});

gulp.task('pug', function() {
	return gulp.src('./src/pug/**/*.pug')
		.pipe(plumber({
			errorHandler: notify.onError(function(err){
				return {
					title: 'Pug',
					sound: false,
					message: err.message
				}
			})
		}))
		.pipe(pug())
		.pipe(htmlbeautify(htmlbeautifyOptions))
		.pipe(gulp.dest('./docs'))
		.pipe(browserSync.stream());
});

var htmlbeautifyOptions = {
	"indent_size": 1,
	"indent_char": "	",
	"eol": "\n",
	"indent_level": 0,
	"indent_with_tabs": true,
	"preserve_newlines": false,
	"max_preserve_newlines": 10,
	"jslint_happy": false,
	"space_after_anon_function": false,
	"brace_style": "collapse",
	"keep_array_indentation": false,
	"keep_function_indentation": false,
	"space_before_conditional": true,
	"break_chained_methods": false,
	"eval_code": false,
	"unescape_strings": false,
	"wrap_line_length": 0,
	"wrap_attributes": "auto",
	"wrap_attributes_indent_size": 4,
	"end_with_newline": false
}

gulp.task('svg', function() {
	return gulp.src('./src/img/svg-for-sprites/*.svg')
	.pipe(svgmin({
		js2svg: {
			pretty: true
		}
	}))
	.pipe(cheerio({
		run: function($) {
			$('[fill]').removeAttr('fill');
			$('[stroke]').removeAttr('stroke');
			$('[style]').removeAttr('style');
		},
		parserOptions: { xmlMode: true }
	}))
	.pipe(replace('&gt', '>'))
	.pipe(svgSprite({
		mode: {
			symbol: {
				sprite: "sprite.svg"
			}
		}
	}))
	.pipe(rename('sprite.svg'))
	.pipe(gulp.dest('./docs/img'));
});

gulp.task('copy:img', function() {
		return gulp.src(['./src/img/**/*.*', '!./src/img/svg-for-sprites/**/*.svg'])
			.pipe(gulp.dest('./docs/img'))
			.pipe(browserSync.stream());
});

gulp.task('copy:js', function() {
		return gulp.src('./src/js/**/*.*')
			.pipe(gulp.dest('./docs/js'))
			.pipe(browserSync.stream());
});

gulp.task('clean:docs', function() {
		return del('./docs');
});

// 1-й вариант добавления библиотек (библиотеки скопированы вручную с сайта)
gulp.task('copy:libs-local', function(callback) {
		gulp.src('./src/libs/**/*.*')
			.pipe(gulp.dest('./docs/libs/'))
			callback()
});

// 2-й вариант добавления библиотек (используем npm)
gulp.task('copy:libs', function(callback) {
	// gulp.src('node_modules/jquery/dist/**/*.*')
	// 	.pipe(gulp.dest('./docs/libs/jquery'));

	gulp.src('node_modules/bootstrap-4-grid/css/**/*.*')
		.pipe(gulp.dest('./docs/libs/bootstrap-4-grid'))

	gulp.src('node_modules/normalize.css/normalize.css')
		.pipe(gulp.dest('./docs/libs/normalize-css/'))
	callback()
});

gulp.task('copy:docs:files', function(callback) {
	gulp.src('./src/php/**/*.*')
		.pipe(gulp.dest('./docs/php/'))

	gulp.src('./src/files/**/*.*')
		.pipe(gulp.dest('./docs/files/'))

	gulp.src('./src/fonts/**/*.*')
		.pipe(gulp.dest('./docs/fonts/'))
	callback()
});

gulp.task('default', function(callback) {
	runSequence(
		'clean:docs',
		['styles', 'pug', 'svg', 'copy:img', 'copy:js', 'copy:libs-local', 'copy:libs', 'copy:docs:files'],
		'server',
		callback
	)
});

/*------------------------------
	DOCS TASKS
------------------------------*/

gulp.task('clean:docs', function() {
		return del('./docs');
});

gulp.task('img:dist', function() {
	return gulp.src('./docs/img/**/*.*')
		.pipe(imagemin({
		progressive: true,
		// optimizationlevel: 5,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()],
		interlaced: true
		}))
		.pipe(gulp.dest('./docs/img'));
});

gulp.task('html:docs', function() {
	return gulp.src('./docs/**/*.html')
		.pipe(usemin({
		// <!-- build:cssVendor css/vendor.css --> <!-- endbuild -->
			cssVendor: [function() { return rev()}, function() { return minifyCss() } ],
			cssCustom: [function() { return rev()}, function() { return minifyCss() } ],
			jsLibs: [function() { return rev()}, function() { return uglify() } ],
			jsVendor: [function() { return rev()}, function() { return uglify() } ],
			jsMain: [function() { return rev()}, function() { return uglify() } ]
		}))
		.pipe(htmlclean())
	.pipe(gulp.dest('./docs/'));
});

gulp.task('copy:docs:files', function(callback) {
    gulp.src('.src/php/**/*.*')
    	.pipe(gulp.dest('./docs/php/'))
    gulp.src('.src/files/**/*.*')
    	.pipe(gulp.dest('./docs/files/'))
    gulp.src('.src/fonts/**/*.*')
    	.pipe(gulp.dest('./docs/fonts/'))
	callback()
});

gulp.task('server:docs', function() {
	browserSync.init({
		server: { baseDir: './docs/'}
	});
});

gulp.task('docs', function(callback) {
	runSequence(
		'clean:docs',
		['styles', 'pug', 'svg', 'copy:img', 'copy:js', 'copy:libs-local', 'copy:libs', 'copy:docs:files'],
		'clean:docs',
		['img:dist', 'copy:docs:files', 'html:docs' ],
		'server:docs',
		callback
	)
});