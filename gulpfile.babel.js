/**
 *   RadekStangel.com :: Gulp Build System
 * =============================================================================
 */
import browserSync from 'browser-sync';
import fs from 'fs';
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

/**
 *   Default :: Development :: Watch For Changes And Reload
 * -----------------------------------------------------------------------------
 */
gulp.task('default', ['sass'], () => {
  browserSync({
    notify: false,
    logPrefix: 'RS',
    server: {
      baseDir: ['src', '.dev']
    }
  });
  gulp.watch(['src/index.html'], browserSync.reload);
  gulp.watch(['src/sass/*.scss'], ['sass']);
});

/**
 *   Serve Distribution :: Build and Serve Distribuition
 * -----------------------------------------------------------------------------
 */
gulp.task('serve:dist', ['dist'], () =>
  browserSync({
    notify: false,
    logPrefix: 'RS',
    server: {
      baseDir: '.'
    }
  })
);

/**
 *   Dist :: Build Distribution Files
 * -----------------------------------------------------------------------------
 */
gulp.task('dist', ['minStyles'], () =>
  gulp.src('src/index.html')
    .pipe($.replace(/<link href=".*app.css"[^>]*>/, function() {
      let style = fs.readFileSync('.dev/css/app.css', 'utf8');
      return '<style>' + style + '</style>';
    }))
    .pipe($.htmlmin({removeComments: true, collapseWhitespace: true}))
    .pipe(gulp.dest('.'))
);

/**
 *   Stylesheet Tasks
 * -----------------------------------------------------------------------------
 */

// Sass :: Compile and Prefix Stylesheet
gulp.task('sass', () =>
  gulp.src('src/sass/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({precision: 4}).on('error', $.sass.logError))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('.dev/css'))
    .pipe(browserSync.stream())
);

// minStyles :: Minify Stylesheet Before Inlining To The Distribution
gulp.task('minStyles', ['sass'], () =>
  gulp.src('.dev/css/app.css')
    .pipe($.cssnano())
    .pipe(gulp.dest('.dev/css'))
);
