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

