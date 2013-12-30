module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      build: {
        files: {'../../public/javascripts/app.js': ['main.js']},
        options: {
          debug: false,
          transform: ['hbsfy']
        }
      }
    },

    uglify: {
      build: {
        src: '../../public/javascripts/app.js',
        dest: '../../public/javascripts/app.js'
      }
    },

    watch: {
      all: {
        files: ['**/*.js'],
        tasks: ['default']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['browserify', 'uglify']);
  grunt.registerTask('dev', ['default', 'watch']);
};