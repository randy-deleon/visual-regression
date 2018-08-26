# visual regression tutorial

## Project Setup

Open your terminal, and run the following commands

```bash
cd c:\
```

Create a directory then navigates to that folder

```bash
mkdir visual-regression && cd visual-regression
```

Create a package.json using the default options

```javascript
  npm init --y
```

Run the command to launch vscode insiders

```javascript
 code-insiders .
```

Install the node dependencies

```javascript
npm i -S babel-cli babel-preset-env babel-plugin-transform-object-rest-spread chalk mz resemblejs puppeteer rimraf shortid yargs
```

```javascript
npm i -D babel-eslint eslint eslint-config-prettier prettier
```

## Configure linters, prettiers, and transpilers

Add the following file at the root folder, and feel free to configure it with your own flavor.

Create an  `.eslintrc` file at the root to put those syntaxes in check.

```json
{
    "extends": [
        "prettier"
    ],
    "parser": "babel-eslint",
    "env": {
        "browser": true,
        "node": true,
        "es6": true
    },
    "rules": {
        "no-unused-vars": "error",
        "no-use-before-define": [2, {
            "functions": false
        }],
        "prefer-const": 1,
        "complexity": [1, 5]
    }
}

```

Create a `.prettierrc` file  to make your code look pretty

```json
{
    "parser": "babylon",
    "singleQuote": true,
    "useTabs": false,
    "trailingComma": "none",
    "printWidth": 80,
    "tabWidth": 2,
    "noSemi": true,
    "rcVerbose": true
}
```

Create a `.babelrc` file at the root and add the code below. This allows us to use the latest and greatest javascript.

```json
{
  "presets": ["env"],
  "plugins": [["transform-object-rest-spread", { "useBuiltIns": true }]]
}
```

Create a `src` folder at the root, and a `utils` folder inside it.

## Utility scripts

Add the following scripts inside the utils folder.

#### Create `logger.js` for logging colorful messages.

```javascript
// src/utils/looger.js

import chalk from 'chalk';

const CYAN = (messageType = `CYAN:`, messageValue = `YOUR MESSAGE`) => {
    return console.log(chalk.cyan(`[${ messageType }]:`) + ` ${ messageValue }`);
};
const MAGENTA = (messageType = `MAGENTA:`, messageValue = `YOUR MESSAGE`) => {
    return console.log(chalk.magenta(`[${ messageType }]:`) + ` ${ messageValue }`);
};
const GREEN = (messageType = `GREEN:`, messageValue = `YOUR MESSAGE`) => {
    return console.log(chalk.green(`[${ messageType }]:`) + ` ${ messageValue }`);
};
const YELLOW = (messageType = `YELLOW:`, messageValue = `YOUR MESSAGE`) => {
    return console.log(chalk.yellow(`[${ messageType }]:`) + ` ${ messageValue }`);
};
const RED = (messageType = `RED:`, messageValue = `YOUR MESSAGE`) => {
    return console.log(chalk.red(`[${ messageType }]:`) + ` ${ messageValue }`);
};

export { CYAN, GREEN, YELLOW, RED, MAGENTA };

```

#### Create a `screenCapture.js` to handle the page screenshots.

```javascript
// src/utils/screenCapture.js

import { launch } from 'puppeteer';
import devices from 'puppeteer/DeviceDescriptors';

process.setMaxListeners(Infinity);

const screenCapture = async (item, pathToSave, fullPage ) => {

  const browser = await launch();
  const page = await browser.newPage();

  item.emulation === `Desktop` ?
    await page.setViewport({ width: 1280, height: 800 }) :
    await page.emulate(devices[item.emulation]);

  const response = await page.goto(item.url, {
    waitUntil: `networkidle0`
  });

  const httpStatus = response.status();
  const statusCode = {statusCode: httpStatus};
  const testItem = {...item, ...statusCode};

  await page.screenshot({ path: `${pathToSave}\\${item.filename}.png`,  fullPage });
  await browser.close();

  return testItem;
};

export default screenCapture;

```

`screenCapture.js` uses [puppeteer](https://github.com/GoogleChrome/puppeteer), chrome's headless browser.

The code simply opens a new page and sets the viewport, navigates to the URL and waits for the content to be loaded for some milliseconds ( [`networkidle0`](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagegotourl-options) ) and gets the HTTP response code, takes a screenshot and then closes the browser.

 #### Create a `compareScreenshot.js` to compare the screenshots.

```javascript
// src/utils/compareScreenshots.js

import { readFile, writeFile } from 'mz/fs';
import compareImages from 'resemblejs/compareImages';
import * as Log from '../utils/logger';

const compareScreenShots = async (
  filename,
  baselinePath,
  resultPath,
  failurePath,
  misMatchPercentage,
  comparisonOptions
) => {
  const screenshotData = await compareImages(
    await readFile(`${baselinePath}\\${filename}.png`), //baseline
    await readFile(`${resultPath}\\${filename}.png`), //new path
    comparisonOptions
  );
  if (parseFloat(screenshotData.misMatchPercentage) > misMatchPercentage) {
    Log.RED(`FAILUIRE`, `on ${filename}`);
    await writeFile(
      `${failurePath}\\${filename}_FAIL.png`,
      screenshotData.getBuffer()
    );
  }
};
export default compareScreenShots;

```

`compareScreenshot.js` compares the baseline screenshots from the new screenshots using [resemblejs](https://github.com/HuddleEng/Resemble.js).

If there's a mismatch from the compared images, it creates a new image in the failure folder highlighting the discrepancies.


#### Create a `fileHelper.js` for checking and creating folders

```javascript
// src/utils/fileHelper.js

import { existsSync, mkdir } from 'mz/fs';
import path from 'path';
import * as Log from './logger';

const checkDirExistence = (name = undefined) => {
  if (typeof name === `string` && path.isAbsolute(name)) {
    const checkDir = existsSync(name);
    return checkDir ? true : false;
  }
};

const checkBaselineFiles = (items, baselinePath) => {
  const checkedfiles = items.map(item => {
    return checkDirExistence(`${baselinePath}\\${item.filename}.png`);
  });
  if (checkedfiles.includes(false)) {
    Log.RED(`ERROR`, `Please run a baseline before running a your test.\n\n`);
    Log.MAGENTA(`TRY THIS`, `"npm run start" and try again.\n\n`);
    process.exit();
  } else {
    Log.MAGENTA(`BASELINE`, `Checked!`);
  }
};
const checkInitialDirectory = (paths) => {
  const checkedfiles = paths.map(item => {
    return checkDirExistence(`${item}`);
  });
  if (checkedfiles.includes(false)) {
    Log.RED(`ERROR`, `Please run a setup before running a your test.\n\n`);
    Log.MAGENTA(`TRY THIS`, `"npm run setup" and try again.\n\n`);
    process.exit();
  } else {
    Log.MAGENTA(`BASELINE`, `Checked!`);
  }
};

const createDirectory = pathname => {
  try {
    const dirExist = checkDirExistence(pathname);
    if (!dirExist) {
      mkdir(pathname);
      Log.GREEN(`SUCCESSFULLY`, `created ${pathname}`);
    } else {
      Log.RED(`${pathname}`, `the path already exists, or you entered an invalid value.`);
    }
  } catch (error) {
    Log.RED(`ERROR`, `${error}`);
  }
}

const createInitialDirectories = async (root = 'screenshots', arrayItems) => {
  try {
    Log.MAGENTA(`SETUP`,`Creating folders.`);
    const rootDir = path.resolve(root);
    createDirectory(rootDir);
    await arrayItems.map(item => {
      const cleanName = item.trim();
      const dir = path.resolve(`${rootDir}\\${cleanName}`);
      createDirectory(dir);
    });
    Log.GREEN(`DONE`,`Creating folders.`);
  } catch (error) {
    Log.RED(`ERROR`, `${error}`);
  }

};

export { checkDirExistence, checkBaselineFiles, checkInitialDirectory, createDirectory, createInitialDirectories };

```

#### Create a `index.js` is the meat of the project.

```javascript
// src/utils/index.js

import compareScreenShots from './compareScreenshots';
import { checkBaselineFiles, checkInitialDirectory, createDirectory } from './fileHelper';
import * as Log from './logger';
import screenCapture from './screenCapture';

const takeNewScreenShots = async (items, resultPath, fullPage) => {
  const itemsCount = items.length;
  createDirectory(resultPath);
  const promises = await items.map(async (item, index) => {
    Log.CYAN(`CAPTURING`, `(${index + 1} of ${itemsCount}) ${item.filename}`);
    return await screenCapture(item, resultPath, fullPage);
  });
  return promises;
};

const createBaseline = async (pages, options) => {
  const items = pages;
  const {
    rootDir,
    baselinePath,
    resultPath,
    failurePath,
    fullPage
  } = options;
  const paths = [rootDir, baselinePath,resultPath,failurePath];

  const checkSetup = await checkInitialDirectory(paths);
  const itemsCount = items.length;
  const promises = await items.map(async (item, index) => {
    Log.CYAN(`CAPTURING`, `(${index + 1} of ${itemsCount}) ${item.filename}`);
    return await screenCapture(item, baselinePath, fullPage);
  });

  await Promise.all([checkSetup, promises])
    .then(() => {
      Log.CYAN(`DONE`, `Creating Baselines`);
    })
    .catch(error => {
      Log.RED(`ERROR`, error);
    });
};

const testBaseline = async (pages, options) => {
  const items = pages;
  const {
    fullPage,
    baselinePath,
    resultPathID,
    failurePath,
    misMatchPercentage,
    comparisonOptions
  } = options;
  const itemsCount = items.length;

  const baselineCheck = await checkBaselineFiles(items, baselinePath);

  const newScreenShotPromises = await takeNewScreenShots(items, resultPathID, fullPage);

  const comparedPromises = await Promise.all(newScreenShotPromises)
    .then(data => {
      Log.CYAN(`DONE`, `Creating Baselines`);
      data.map(async (item, index) => {
        Log.GREEN(`CAPTURING`, `(${index + 1} of ${itemsCount}) ${item.filename}`);
        await compareScreenShots(
          item.filename,
          baselinePath,
          resultPathID,
          failurePath,
          misMatchPercentage,
          comparisonOptions
        );
        return item.filename;
      });
    })
    .catch(error => {
      Log.RED(`ERROR`, error);
    });

  await Promise.all([baselineCheck, newScreenShotPromises, comparedPromises])
    .then(() => Log.GREEN(`DONE`, `Comparing Images`))
    .catch(error => {
      Log.RED(`ERROR`, error);
      process.exit();
    });
};

export { createBaseline, testBaseline };

```

The `createBaseline` function takes a screenshot of the pages, then stores the image in the baselines folder.

The `testBaseline` has three main functions.  Its first function checks the baseline folder if an image exists, this ensures that we're comparing apples to apples and the baseline folder is pristine as possible. the second takes new screenshots, a unique folder is generated every time. this function is invoked so we don't have to delete the contents in the results folder on, every test. the third function compares baseline images with the new screenshots. Since I ran a check the first time, we can assure our image will have something to compare against just in case the data changes without running a baseline.

## The `src` folder

#### Create options.js under src folder

`options.js` is an object where you can configure your directories, screenshots, and comparison options.

```javascript
// src/options.js

import path from 'path';
import shortId from 'shortid';

const rootDir = path.resolve(`screenshots`);// .
const baselinesDir = `baselines`;
const failuresDir = `failures`;
const resultsDir = `results`;

const Options = {
  rootDir,
  baselinesDir,
  failuresDir,
  resultsDir,
  baselinePath: `${rootDir}\\${baselinesDir}`,
  resultsPath:`${rootDir}\\${resultsDir}`,
  resultPathID: `${rootDir}\\${resultsDir}\\${shortId.generate()}`,
  failurePath: `${rootDir}\\${failuresDir}`,
  misMatchPercentage: 30.0,
  fullPage: true,
  comparisonOptions: {
      output: {
        errorColor: {
          red: 255,
          green: 0,
          blue: 255
        },
        errorType: `movement`,
        transparency: 0.3,
        largeImageThreshold: 1200, //0
        useCrossOrigin: false,
        outputDiff: true
      },
      scaleToSameSize: true,
      ignore: [`nothing`, `less`, `antialiasing`, `colors`, `alpha`]
    }
};

export default Options;

```

#### Create a mock data


See the [device descriptors](https://github.com/GoogleChrome/puppeteer/blob/master/DeviceDescriptors.js) for a list of emulation values.

```javascript
// src/pages.js

const Pages = [
  {url: "https://randydeleon.com/blog", filename: "randy-blog-desktop", emulation: "Desktop"},
  {url: "https://randydeleon.com/blog", filename: "randy-blog-tablet", emulation: "iPad Pro landscape"},
  {url: "https://randydeleon.com/blog", filename: "randy-blog-mobile", emulation: "iPhone 6"}
];

```

If you notice `Desktop` is not part of the device descriptors, So I created my own and call it `Desktop`.

```javascript
 item.emulation === `Desktop` ?
    await page.setViewport({ width: 1280, height: 800 }) :
    await page.emulate(devices[item.emulation]);
```

#### Create index.js under src folder

This is the application entry point, when the script runs it determines which function to call by reading the runtype argument

```javascript
// src/index.js

"use strict;"
import yargs from "yargs";
import options from './options';
import pages from './pages';
import { createBaseline, testBaseline } from './utils';
import { createInitialDirectories } from './utils/fileHelper';
import { MAGENTA } from './utils/logger';

const args = yargs.parse();

(async () => {
  switch (args.runtype) {
    case 'setup':
      const { rootDir, baselinesDir, resultsDir, failuresDir } = options;
      await createInitialDirectories(rootDir, [baselinesDir, resultsDir, failuresDir]);
      break;
    case 'baseline':
      await createBaseline(pages, options)
      break;
    case 'test':
      await testBaseline(pages, options)
      break;
    default:
      MAGENTA(`HELLO!`, `https://randydeleon.com`);
      break;
  }
})();

```

## Script Reference

Add the following in the packages.json

```javscript
 "scripts": {
    "presetup": "babel-node src/index.js",
    "setup": "babel-node src/index.js --runtype setup",
    "start": "babel-node src/index.js --runtype baseline",
    "test": "babel-node src/index.js --runtype test",
    "yolo": "rimraf screenshots",
    "clean:baselines": "rimraf screenshots/baselines/*",
    "clean:failures": "rimraf screenshots/failures/*",
    "clean:results": "rimraf screenshots/results/*",
    "clean:all": "rimraf screenshots/*",
    "eslint:check": "eslint --print-config . | eslint-config-prettier-check",
    "lint": "eslint src/**",
    "lint:fix": "eslint src/** --fix"
  },

```

## Running the scripts

#### Setup

```javascript
npm run setup
```
creates screenshot, baselines, results, and failures directories

#### Start
```javascript
npm start
```
creates baseline screenshots

#### Test

```javascript
npm test
```
takes new screenshot and compares it with the baselines

#### Deleting baseline folder

```javascript
npm run clean:baselines
```
deletes the baselines folder and everything in it.


#### Deleting failures folder

```javascript
npm run clean:failures
```
deletes the faiulres folder and everything in it.


#### Deleting results folder

```javascript
npm run clean:results
```
deletes the results folder and everything in it.


#### Deleting screenshots folder contents

```javascript
npm run clean:all
```
deletes everything inside the screenshot folder.


#### Deleting the screenshots folder

```javascript
npm run yolo
```
deletes the screenshots folder.

<br />
<br />

Thanks for reading!


