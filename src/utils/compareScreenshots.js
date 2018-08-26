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