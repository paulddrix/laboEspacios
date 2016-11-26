const gulp = require('gulp');
const fs = require('fs');
const async = require('async');
const child_process  = require('child_process');
const exec = require('child_process').exec;
const sass = require('gulp-sass');
const handyUtils = require('handyutils');
const nodemon   = require('gulp-nodemon');
const moment = require('moment');
// Dot Env File Loader
if(!process.env.PORT){
	let dotenv = require('dotenv').load();
}
// startup required services to run the app server
gulp.task('mongod', () => { 
    // spawn in a child process mongodb
    child_process.exec('mongod', (err,stdout,stderr) => {
    	console.log(stdout);
    });
});
// Create keys and store them in the right folder
gulp.task('genRSAKeys', () => { 
  exec('openssl genrsa -out ./keys/private.pem 1024 && openssl rsa -in ./keys/private.pem -pubout > ./keys/public.pub', function(err,stdout,stderr){
    console.log(stdout);
  });
});
gulp.task('envFile', () => { 
  exec('echo \"DEBUG=True\" > ./.env', (err,stdout,stderr) => {
    console.log(stdout);
  });
});
// Run app.js with nodemon
gulp.task('dev', () => {
  nodemon({ script: 'app.js'
          , ext: 'js' }).on('restart', () => {
      console.log('restarted!')
  });
});
// Run mocha tests
gulp.task('test',() => {
    // spawn in a child process mongodb
    exec('mocha', (err,stdout,stderr) => {
        console.log(stdout);
    });
});
// sass
gulp.task('sass',() => {
    return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css/'));
});
gulp.task('sass:watch',() => {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

// setup dev environment
  gulp.task('setup', ['genRSAKeys', 'envFile']);

// start dev environment
  gulp.task('start', ['dev','sass:watch']);