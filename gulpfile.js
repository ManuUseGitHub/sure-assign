/* eslint-disable @typescript-eslint/no-var-requires */

const gulp = require( "gulp" );

const uglify = require( "gulp-uglify" );
const rename = require( "gulp-rename" );

// eslint-disable-next-line no-undef
const moduleName = /^.+\/(.+)$/.exec( process.env.PWD )[ 1 ];
gulp.task( "compress" , done => {

  gulp.src( `./${moduleName}/*.js` )
    .pipe( uglify() )
    .pipe( rename( function ( path ) {
      path.extname = `${path.extname}`;
    } ) )
    .pipe( gulp.dest( `./${moduleName}/dist` ) );

  done();
} );