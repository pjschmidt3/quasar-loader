// Karma configuration
// Generated on Sat Sep 30 2017 04:22:56 GMT-0500 (CDT)
var path = require('path')
  , root = __dirname
  , srcRoot = path.join(root, 'lib');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'mocha', 'chai', 'sinon' ],


    // list of files / patterns to load in the browser
    files: [
      'test/index.js'
    ],


    // list of files to exclude
    excludes: ['node_modules'],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/index.js': [ 'webpack', 'sourcemap' ]
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [ 'mocha', 'coverage' ],

    plugins: [
      require('karma-mocha'),
      require('karma-chai'),
      require('karma-sinon'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
      require('karma-phantomjs-launcher'),
      require('karma-mocha-reporter'),
      require('karma-coverage')
      // require('karma-coverage-istanbul-reporter')
    ],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [ 'PhantomJS' ],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    // babelPreprocessor: {
    //   options: {
    //     presets: [
    //       {
    //         plugins: [
    //         "transform-runtime",
    //         "transform-class-properties",
    //         "transform-object-rest-spread",
    //         ]
    //       },
    //       "es2015",
    //       "stage-0"
    //     ]
    //   }
    // }
    // 
    webpack: {
      devtool: 'inline-source-map',
      resolve: {
        extensions: [ '.js' ],
        modules: [
          srcRoot,
          path.join(root, 'node_modules')
        ],
      },
      module: {
        rules: [{
          test: /\.js$/,
          include: [ srcRoot ],
          loader: 'babel-loader',
          options: {
            presets: [
            {
              plugins: [
                "transform-runtime",
                "transform-class-properties",
                "transform-object-rest-spread"
              ]
            },
            "es2015",
            "stage-0"
          ]
          }
        }, {
          test: /\.js$/,
          exclude: /node_modules|\.spec\.js$/,
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true },
          enforce: 'post'
        }]
      }
    },

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {
          type: 'html',
          subdir: 'report-html'
        },
        {
          type: 'lcov',
          subdir: 'report-lcov'
        },
        {
          type: 'cobertura',
          subdir: '.',
          file: 'cobertura.txt'
        }
      ]
    },

    webpackMiddleware: {
      noInfo: true
    }
  });
};
