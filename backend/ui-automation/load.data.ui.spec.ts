import { test, expect, chromium, Page } from '@playwright/test';
import { readCaptcha } from '../utils/captcha.utils';
import { powerCutDetails } from '../types/types';
import { getPowerCutDetail, setPowerCutDetail } from '../utils/database.util';
import 'dotenv/config'

test('Load data from UI', async ({ page }) => {
  test.setTimeout(12000000);
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const newPage = await context.newPage();
  await newPage.goto('https://www.tnebltd.gov.in/outages/viewshutdown.xhtml');

  const captchaText = await readCaptchaFromImage(newPage);
  console.log(`Captcha Text: ${captchaText}`);
  await newPage.fill('input[id*="cap"]', captchaText);

  // Click the submit button
  await newPage.click('button[id*="submit3"]');

  const select = await newPage.waitForSelector('label > select');
  await select.selectOption('100');
  const powerCutData = await extractPowerCutDetails(newPage);
  console.log(powerCutData);

  await browser.close();
});

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function extractPowerCutDetails(page: Page): Promise<powerCutDetails[]> {
  const powerCutDetails: powerCutDetails[] = [];
  let k =0;
  let exitLoop:boolean = false;
  while (k<5) {
    const rows = page.locator('tbody tr');
    const rowCount = await rows.count();
    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);

      // Click on the first cell to expand the row
      await row.locator('td:first-child').click();

      // Wait for the hidden cells to become visible
      await page.waitForSelector('td:not([style*="display: none"])');

      const cells = row.locator('td');
      if (await cells.count() === 8) {
        const details: powerCutDetails = {
          dateOfOutage: new Date(parseDate((await cells.nth(0).textContent() || '').trim())),
          town: (await cells.nth(1).textContent() || '').trim(),
          substation: (await cells.nth(2).textContent() || '').trim(),
          feeder: (await cells.nth(3).textContent() || '').trim(),
          location: (await cells.nth(4).textContent() || '').trim(),
          typeOfWork: (await cells.nth(5).textContent() || '').trim(),
          fromDate: new Date(parseFromDateTime((await cells.nth(6).textContent() || '').trim())),
          toDate: new Date(parseToDateTime((await cells.nth(7).textContent() || '').trim())),
        };
        const powerCutDetailfromDb: powerCutDetails = await getPowerCutDetail(details.dateOfOutage, details.town, details.location, details.substation, details.feeder);
        if (!powerCutDetailfromDb) {
          powerCutDetails.push(details);
          await setPowerCutDetail(details.dateOfOutage, details.town, details.location, details.substation, details.feeder)
        } else {
          if(process.env.FIRST_TIME_LOAD !== 'true'){
            exitLoop =true;
            break;
          }
           
        }

      }

      // Click again to collapse the row (optional, depending on your needs)
      await row.locator('td:first-child').click();
    }
    if(exitLoop){
      break;
    }
    await page.click(".paginate_button.next a")
    k++;
  }

  return powerCutDetails;
}




async function readCaptchaFromImage(newPage: Page): Promise<string> {
  const captchaElement = await newPage.waitForSelector('img[id*="imgCaptchaId"]');
  const captchaPath = 'captcha.png';
  await captchaElement?.screenshot({ path: captchaPath });
  const captchaText = await readCaptcha(captchaPath);
  return captchaText;
}


function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split('-').map(Number);

  // Months in JavaScript Date are zero-based (0-11), so subtract 1 from month
  return new Date(year, month - 1, day);
}

function parseFromDateTime(dateTimeString: string): Date {
  const [datePart, timePart] = dateTimeString.trim().split(/\s+/);
  const [day, month, year] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  // Months in JavaScript Date are zero-based (0-11), so subtract 1 from month
  const date = new Date(Date.UTC(year, month - 1, day, hour - 5, minute - 30));
  return date;
}


function parseToDateTime(dateTimeString: string): Date {
  const [datePart, timePart] = dateTimeString.trim().split(/\s+/);
  const [day, month, year] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  console.log(`datepart ${datePart}`)
  console.log(timePart)

  // Months in JavaScript Date are zero-based (0-11), so subtract 1 from month, adding 12 convert to 24 hr format.
  const date = new Date(Date.UTC(year, month - 1, day, hour + 12 - 5, minute - 30));
  return date;
}