module.exports = function(grunt) {

  grunt.initConfig({

    browserify: {
      build: {
        files: {'public/javascripts/app.js': ['target/client/main.js']},
        options: {
          debug: false,
          transform: ['hbsfy']
        }
      }
    },

    uglify: {
      build: {
        src: 'public/javascripts/app.js',
        dest: 'public/javascripts/app.js'
      }
    },

    watch: {
      options: {
        livereload: true
      },
      app: {
        files: ['app/**/*.*']
      },
      scripts: {
        files: ['client/**/*.js'],
        tasks: ['default']
      }
    },

    copy: {
      all: {
        files: [
          {expand: true, src: ['client/**'], dest: 'target'}
        ]
      }
    },

    'es6-arrow': {
      all: {
        src: ['target/client/**/*.js']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['copy', 'es6-arrow', 'browserify']);
  grunt.registerTask('dev', ['default', 'watch']);


  // Compiling the es6 arrow manually is much faster than using the browserify transform.
  grunt.registerMultiTask('es6-arrow', 'es6-arrow', function() {
    var fs = require('fs');
    var compile = require('es6-arrow-function').compile;

    this.files.forEach(function(file) {
      file.src.forEach(function(filePath) {
        var fileContent = grunt.file.read(filePath);
        grunt.file.write(filePath, compile(fileContent));
      });
    });
  });

};