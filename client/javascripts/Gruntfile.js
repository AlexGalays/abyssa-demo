module.exports = function(grunt) {

  grunt.initConfig({
    browserify: {
      build: {
        files: {'../../public/javascripts/app.js': ['main.js']},
        options: { debug: true }
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

  grunt.registerTask('default', ['browserify']);
  grunt.registerTask('dev', ['default', 'watch']);
};