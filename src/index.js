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
      MAGENTA(`REPOSITORY`, `https://github.com/randy-deleon/visual-regression`);
      break;
  }
})();