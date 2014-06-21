'use strict';

module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    column_lint: {
      files: {
        src: ['./lib/**/*.js']
      }
    },

    jshint: {
      src: ['./lib/**/*.js'],
      options: {
        jshintrc: './jshintrc.js'
      }
    },

    lintspaces: {
      javascript: {
        src: ['./lib/**/*.js'],
        options: {
          indentation: 'spaces',
          spaces: 2,
          newline: true,
          trailingspaces: true,
          ignores: ['js-comments']
        }
      }
    },

    mocha_istanbul: {
      coverage: {
        src: './test',
        options: {
          mask: '*.spec.js'
        }
      },
      coveralls: {
        src: './test',
        options: {
          coverage: true,
          check: {
            lines: 75,
            statements: 75
          },
          root: './lib',
          reporter: 'spec',
          reportFormats: ['html', 'lcovonly']
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-lintspaces');
  grunt.loadNpmTasks('grunt-column-lint');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-istanbul');

  grunt.registerTask('default', ['format']);
  grunt.registerTask('format', ['lintspaces', 'jshint', 'column_lint']);
  grunt.registerTask('test', ['format', 'mocha_istanbul:coveralls', 'mocha_istanbul:coverage']);
};
