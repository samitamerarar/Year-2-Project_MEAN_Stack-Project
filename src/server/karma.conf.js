module.exports = function(config) {
  var appBase    = 'out/';      // transpiled app JS and map files
  var appSrcBase = 'app/';      // app source TS files
  var appAssets  = 'base/app/'; // component assets fetched by Angular's compiler

  // Testing helpers (optional) are conventionally in a folder called `testing`
  var testingBase    = 'testing/'; // transpiled test JS and map files
  var testingSrcBase = 'testing/'; // test source TS files

  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],

    plugins: [
        require('karma-mocha'),
        require('karma-mocha-reporter'),
        require('karma-chai'),
        require('karma-firefox-launcher'),
        require('karma-chrome-launcher'),
        require('karma-coverage')
    ],
    
    client: {
      builtPaths: [appBase, testingBase], // add more spec base paths as needed
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },

    customLaunchers: {
      // From the CLI. Not used here but interesting
      // chrome setup for travis CI using chromium
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    
    files: [
        // System.js for module loading
        'node_modules/systemjs/dist/system.src.js',

        { pattern: 'systemjs.config.js', included: false, watched: false },
        { pattern: 'systemjs.config.extras.js', included: false, watched: false },
        'karma-test-shim.js', // optionally extend SystemJS mapping e.g., with barrels

        { pattern: 'systemjs.config.js', included: false, watched: false },
        { pattern: 'systemjs.config.extras.js', included: false, watched: false },
        'karma-test-shim.js', // optionally extend SystemJS mapping e.g., with barrels

        // transpiled application & spec code paths loaded via module imports
        { pattern: appBase + '**/*.js', included: false, watched: true },
        { pattern: testingBase + '**/*.js', included: false, watched: true },


        // Asset (HTML & CSS) paths loaded via Angular's component compiler
        // (these paths need to be rewritten, see proxies section)
        { pattern: appSrcBase + '**/*.html', included: false, watched: true },
        { pattern: appSrcBase + '**/*.css', included: false, watched: true },

        // Paths for debugging with source maps in dev tools
        { pattern: appSrcBase + '**/*.ts', included: false, watched: false },
        { pattern: appBase + '**/*.js.map', included: false, watched: false },
        { pattern: testingSrcBase + '**/*.ts', included: false, watched: false },
        { pattern: testingBase + '**/*.js.map', included: false, watched: false}
    ],
      
    proxies: {
       "/app/": appAssets,
    },

    exclude: [],
    // Change if appBase changes
    preprocessors: {
        'out/**/!(*spec).js': ['coverage']
    },
    
    reporters: ['mocha','coverage'],

    mochaReporter: {
      maxLogLines: -1
    },
    
    coverageReporter: {
        includeAllSources: true,
        reporters:[
            {type: 'json', subdir: '.', file: 'coverage-final.json'}
        ]
    },
    
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Firefox'],
    singleRun: false
  })
}