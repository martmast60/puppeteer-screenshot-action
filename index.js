const core = require("@actions/core");
const puppeteer = require("puppeteer-core");
const io = require("@actions/io");
const os = require("os");
const path = require("path");

function getChromePath() {
  let browserPath;

  if (os.type() === "Windows_NT") {
    // Chrome is usually installed as a 32-bit application, on 64-bit systems it will have a different installation path.
    const programFiles =
      os.arch() === "x64"
        ? process.env["PROGRAMFILES(X86)"]
        : process.env.PROGRAMFILES;
    browserPath = path.join(
      programFiles,
      "Google/Chrome/Application/chrome.exe"
    );
  } else if (os.type() === "Linux") {
    browserPath = "/usr/bin/google-chrome";
  } else if (os.type() === "Darwin") {
    browserPath =
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }

  if (browserPath && browserPath.length > 0) {
    return path.normalize(browserPath);
  }

  throw new TypeError(`Cannot run action. ${os.type} is not supported.`);
}

(async () => {
  try {
    await io.mkdirP(`${process.env.GITHUB_WORKSPACE}/screenshots/`);

    const url = core.getInput("url");

    const timestamp = new Date().getTime();
    const width = parseInt(core.getInput("width"));
    const height = parseInt(core.getInput("height"));
    const fullPage = core.getInput("fullPage") === "true";
    const screenshotName =
      core.getInput("screenshotName") !== "false"
        ? core.getInput("screenshotName")
        : `screenshot-${timestamp}`;

    const browser = await puppeteer.launch({
      executablePath: getChromePath(),
    });
    const page = await browser.newPage();
    
    
//     await page.goto(url, {
//       waitUntil: "networkidle2",
//     });
    
    
//     await page.waitFor(3000);
    
        page.setViewport({ width: 1366, height: 768 });

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36');
    await page.goto("https://ccp.cloudaccess.net/index.php?rp=/login");
    await page.click('#inputEmail');
    await page.keyboard.type('martmast60@gmail.com');
    await page.click('#inputPassword');
    await page.keyboard.type('@Anu123456');
    await page.click('#login');
    await page.waitForNavigation();
    await page.waitForSelector("#trials-table > tbody > tr > td:nth-child(5) > form > input.btn.btn-warning.js-show-upgrade-popup",{timeout: 50000});

    await page.evaluate(() => {
        document.querySelector("#trials-table > tbody > tr > td:nth-child(5) > form > input.btn.btn-warning.js-show-upgrade-popup").click();
        setTimeout(() => {
            document.querySelector("#trials-table > tbody > tr > td:nth-child(5) > form > input.btn.btn-warning.js-show-upgrade-popup").click();
        },1500);
        
    });



    // await page.click(RENEW_BTN);
    // await page.click(RENEW_BTN, {delay: 3000});
    await page.waitForNavigation();
    
    
    await page.waitForSelector("#show-notif > div > div > div.modal-body > h4");
    
    const resp = await page.evaluate(() => {
                        let items = document.querySelectorAll("#show-notif > div > div > div.modal-body > h4").innerText;
return items;
    });
    
        console.log("RESPONSE :::::::: ");

    console.log(resp);

    
    
    await page.screenshot({
      fullPage,
      path: `${process.env.GITHUB_WORKSPACE}/screenshots/${screenshotName}.png`,
    });
    await browser.close();

    core.exportVariable("TIMESTAMP", timestamp);
  } catch (error) {
    core.setFailed(`Failed to run action. ${error}`);
    process.exit(1);
  }
})();
