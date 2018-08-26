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