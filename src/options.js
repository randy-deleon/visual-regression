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
  misMatchPercentage: 0.10,
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
