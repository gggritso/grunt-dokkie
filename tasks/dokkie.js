/*
 * grunt-dokkie
 * https://github.com/gggritso/grunt-dokkie
 *
 * Copyright (c) 2013 George Gritsouk
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Imports
  var markdown = require( 'markdown' ).markdown,
    mde = require( 'markdown-extra' ),
    handlebars = require( 'handlebars' ),
    path = require( 'path' );

  // Helper function to pull metadata from a markdown file
  function metaProcessor( data ) {
    var lines = data.split( '\n' ), meta = {}, line, sp;
    for ( var i = 0, len = lines.length; i < len; i += 1 ) {
      sp = lines[ i ].split( ': ', 2 );
      if ( sp[0] ) { meta[ sp[0] ] = sp[ 1 ]; }
    }

    return meta;
  }

  // Task Function
  function dokkie() {

    var data = this.data;

    var tmpl_content = grunt.file.read( path.join( data.src, 'template.html' ) );
    var template = handlebars.compile( tmpl_content );

    var content, html, nFilename, oExtension, sp, depth;
    var docMeta, docMeat, cssPath;
    grunt.file.recurse( data.src, function( absPath, rootDir, subDir, filename ) {

      depth = ( subDir ) ? subDir.split( '/' ).length : 0;

      sp = filename.split( '.' );
      nFilename = sp.slice( 0, -1 ).join( '.' ) + '.html';
      oExtension = sp.slice( -1 )[ 0 ];

      if ( [ 'markdown', 'md' ].indexOf( oExtension.toLowerCase() ) !== -1 ) {

        content = grunt.file.read( absPath );
        docMeta = mde.metadata( content, metaProcessor );
        docMeat = mde.content( content );

        html = template({
          body: markdown.toHTML( docMeat ),
          title: docMeta.title || nFilename,
          stylesheet_location: ( new Array( depth + 1) ).join( '../' ) + 'style.css'
        });
        grunt.file.write( path.join( data.dest, subDir || '', nFilename ), html );

      }

    });

    grunt.file.copy( path.join( data.src, 'style.css' ), path.join( data.dest, 'style.css' ) );

  }

  // Task Registration
  grunt.registerMultiTask('dokkie', 'Make nice HTML documentation from your Markdown files.', dokkie );

};
