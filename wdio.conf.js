require(`dotenv`).config();
require(`babel-register`);
let mochaTimeout = 30000;
if (process.env.DEBUG_JOURNEYS) {
  mochaTimeout = 99999999;
}
exports.config = {
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  specs: [`./test/journeys/specs/**/*.js`],
  suites: {
    tap: [
      `./test/journeys/specs/tap/**/*.js`
    ],
    oneOnOne: [
      `./test/journeys/specs/oneOnOne/**/*.js`
    ],
    space: [
      `./test/journeys/specs/space/**/*.js`
    ],
    messageMeet: [
      `./test/journeys/specs/messageMeet/**/*.js`
    ],
    recents: [
      `./test/journeys/specs/recents/**/*.js`
    ]
  },
  // Patterns to exclude.
  exclude: [],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: 10,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: {
    browserLocal: {
      desiredCapabilities: {
        browserName: `chrome`,
        chromeOptions: {
          args: [
            `--use-fake-device-for-media-stream`,
            `--use-fake-ui-for-media-stream`
          ],
          prefs: {
            "profile.default_content_setting_values.notifications": 2
          }
        },
        platform: `mac`
      }
    },
    browserRemote: {
      desiredCapabilities: {
        browserName: `chrome`,
        chromeOptions: {
          args: [
            `--use-fake-device-for-media-stream`,
            `--use-fake-ui-for-media-stream`
          ],
          prefs: {
            "profile.default_content_setting_values.notifications": 2
          }
        },
        platform: `mac`
      }
    }
  },
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // By default WebdriverIO commands are executed in a synchronous way using
  // the wdio-sync package. If you still want to run your tests in an async way
  // e.g. using promises you can set the sync option to false.
  sync: true,
  //
  // Level of logging verbosity: silent | verbose | command | data | result | error
  logLevel: `silent`,
  //
  // Enables colors for log output.
  coloredLogs: true,
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Saves a screenshot to a given path if a command fails.
  // screenshotPath: './errorShots/',
  //
  // Set a base URL in order to shorten url command calls. If your url parameter starts
  // with "/", then the base url gets prepended.
  baseUrl: `http://localhost:4567`,
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 30000,
  //
  // Default timeout in milliseconds for request
  // if Selenium Grid doesn't send response
  connectionRetryTimeout: 90000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Initialize the browser instance with a WebdriverIO plugin. The object should have the
  // plugin name as key and the desired plugin options as properties. Make sure you have
  // the plugin installed before running any tests. The following plugins are currently
  // available:
  // WebdriverCSS: https://github.com/webdriverio/webdrivercss
  // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
  // Browserevent: https://github.com/webdriverio/browserevent
  // plugins: {
  //   webdrivercss: {
  //     screenshotRoot: 'my-shots',
  //     failedComparisonsRoot: 'diffs',
  //     misMatchTolerance: 0.05,
  //     screenWidth: [320,480,640,1024]
  //   },
  //   webdriverrtc: {},
  //   browserevent: {}
  // },
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services: [process.env.SAUCE ? `sauce` : `selenium-standalone`, `static-server`],
  //
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: http://webdriver.io/guide/testrunner/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: `mocha`,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: http://webdriver.io/guide/testrunner/reporters.html
  // NOTE: Omitting `xunit` for now. We can revisit that on another pass
  reporters: [`spec`],

  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: `bdd`,
    timeout: mochaTimeout
  },

  // Static Server setup
  staticServerFolders: [
    {mount: `/dist`, path: `./packages/node_modules/@ciscospark/widget-space/dist`},
    {mount: `/dist-recents`, path: `./packages/node_modules/@ciscospark/widget-recents/dist`},
    {mount: `/dist-wmm`, path: `./packages/node_modules/@ciscospark/widget-message-meet/dist`},
    {mount: `/`, path: `./test/journeys/server/`}
  ],
  staticServerPort: 4567
};

if (process.env.SAUCE) {
  exports.config = Object.assign(exports.config, {
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    build: process.env.BUILD_NUMBER,
    sauceConnect: true,
    sauceConnectOpts: {
      noSslBumpDomains: [
        `mercury-connection-a.wbx2.com`,
        `mercury-connection-integration.wbx2.com`
      ],
      tunnelDomains: [
        `127.0.0.1`,
        `localhost`
      ]
    }
  });
}
