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

