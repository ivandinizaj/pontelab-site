'use strict';

// Include project requirements.
var env       = require('minimist')(process.argv.slice(2)),
    gulp      = require('gulp'),
    $         = require('gulp-load-plugins')(),
    path      = require('path'),
    jeet      = require('jeet'),
    rupture   = require('rupture'),
    koutoSwiss = require('kouto-swiss'),
    fs        = require('fs'),
    psi       = require('psi'),
    browserSync = require('browser-sync'),
    runSequence = require('run-sequence'),
    reload      = browserSync.reload;
    
var paths = {

    minifyFiles: ['src/scripts/**/*.js', '!src/scripts/**/_*.js'],
    lintFiles: ['src/scripts/**/*.js', '!src/scripts/vendor/**/*.js'],
    
    allSrcFiles: 'src/scripts/**/*.js',
    distFolder: 'dist/scripts',

    allStylusFiles :  'src/styles/**/*.styl'  ,
    ignoreStylusFiles : '!src/styles/**/_*.styl',
    stylusFolder: 'src/styles/',
    cssFolder: 'dist/styles',

    fontsFiles: 'src/fonts/**',
    fontsFolder: 'dist/fonts',

    otimizeFiles : ['src/images/**/*.{png,jpg,gif}', '!src/images/**/_*.{png,jpg,gif}' ],
    imgFolder : 'dist/images',

};

var onError = function (err){
  console.log(err);
};

var fileName = function (file) {
  return file.replace(/.\w+$/,"");
};

gulp.task('jade', function(){
  
  return gulp.src('src/templates/*.jade')
    .pipe( $.plumber( { errorHandler: onError } ) )
    .pipe( $.data(function(file) {
      return JSON.parse(fs.readFileSync('./locate/' + path.basename(fileName(file.path)) + '.json'));
    }))
    .pipe( $.jade({
            pretty: !env.p
          }) )
    .pipe( gulp.dest('dist/') )
    .pipe(reload({ stream: true }));

});

// Watch files for changes & reload
gulp.task('serve', ['styles'], function () {
  browserSync({
    notify: false,
    logPrefix: 'BS',
    server: {
      baseDir: "dist",
      index: "pt.html",
      tunnel: true
    },
    ghostMode: {
      scroll: true
    }  
  });

  gulp.watch('src/templates/**/*.jade', ['jade']);
  gulp.watch('assets/**/*.{png,jpg,gif}', reload);
  gulp.watch('locate/*.json',['jade', reload]);
  gulp.watch( paths.allSrcFiles, ['lint','minify', reload] );
  gulp.watch( paths.allStylusFiles, ['styles', reload] );

});

gulp.task('lint', function() {

  return gulp.src(paths.lintFiles)
      .pipe( $.jshint() )
      .pipe( $.jshint.reporter('default') )
      .pipe(reload({ stream: true }));

});

gulp.task('minify', function() {

  return gulp.src(paths.minifyFiles)
      .pipe( $.imports() )
      .pipe( $.if(env.p, $.uglify()) )
      .pipe( gulp.dest( paths.distFolder ) );
});

gulp.task('fonts', function () {

  return gulp.src(paths.fontsFiles)
    .pipe( gulp.dest(paths.fontsFolder) );

});

gulp.task('styles', function() {

  return gulp.src([ paths.allStylusFiles, paths.ignoreStylusFiles ])
    .pipe( $.plumber({
      errorHandler: onError
    }))
    
    .pipe( $.stylus({
        use: [ koutoSwiss(),jeet(), rupture() ],
        compress: env.p
      }) )

    .pipe( gulp.dest( paths.cssFolder ) )
    .pipe(reload({ stream: true }));

});

gulp.task( 'optimize', function () {

  // Optimize all images.
  return gulp.src( paths.otimizeFiles )
        
  .pipe( $.imagemin({
    optimizationLevel: 7,
    progressive: true
  }) )

  .pipe( gulp.dest( paths.imgFolder ) );

});

gulp.task('mobile', function () {
    return psi('http://www.html5rocks.com', {
        // key: key
        nokey: 'true',
        strategy: 'mobile',
    }, function (err, data) {
        console.log(err);
    });
});

// Build production files, the default task
gulp.task('default', function (cb) {
  runSequence('jade','styles', ['minify','lint', 'fonts'], cb);
});