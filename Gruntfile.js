/*
 * grunt-dokkie
 * https://github.com/gggritso/grunt-dokkie
 *
 * Copyright (c) 2013 George Gritsouk
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    dokkie: {
      dist: {
        src: 'docs',
        dest: 'rendered_docs'
      }
    }
  });

  grunt.loadTasks( 'tasks' );

};
