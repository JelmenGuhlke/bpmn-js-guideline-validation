var path = require('path');

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  /**
   * Resolve external project resource as file path
   */
  function resolvePath(project, file) {
    return path.join(path.dirname(require.resolve(project)), file);
  }

  grunt.initConfig({
    browserify: {
      options: {
        browserifyOptions: {
          debug: true
        },
        transform: [
          [ 'stringify', {
            extensions: [ '.bpmn' ]
          } ],
          [ 'babelify', {
            global: true,
            presets: ["es2015"],
            plugins: ["transform-class-properties"]
          } ]
        ]
      },
      watch: {
        options: {
          watch: true
        },
        files: {
          'dist/index.js': [ 'lib/**/*.js', 'example/**/*.js']
        }
      },
      app: {
        files: {
          'dist/index.js': [ 'lib/**/*.js', 'example/**/*.js']
        }
      }
    },
    copy: {
      diagram_js: {
        files: [
          {
            src: resolvePath('diagram-js', 'assets/diagram-js.css'),
            dest: 'dist/css/diagram-js.css'
          }
        ]
      },
      bpmn_js: {
        files: [
          {
            expand: true,
            cwd: resolvePath('bpmn-js', 'dist/assets'),
            src: ['**/*.*', '!**/*.js'],
            dest: 'dist/vendor'
          }
        ]
      },
      app: {
        files: [
          {
            expand: true,
            cwd: 'example/',
            src: ['**/*.*', '!**/*.js'],
            dest: 'dist'
          },
          {
            expand: true,
            cwd: 'assets/',
            src: ['**/*.*', '!**/*.js'],
            dest: 'dist'
          }
        ]
      }
    },
    watch: {
      options: {
        livereload: true
      },
      samples: {
        files: [ 'app/**/*.*' ],
        tasks: [ 'copy:app' ]
      },
    },
    connect: {
      livereload: {
        options: {
          port: 9013,
          livereload: true,
          hostname: 'localhost',
          open: true,
          base: [
            'dist'
          ]
        }
      }
    }
  });

  // tasks

  grunt.registerTask('build', [ 'copy', 'browserify:app' ]);

  grunt.registerTask('auto-build', [
    'copy',
    'browserify:watch',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('default', [ 'build' ]);
};
