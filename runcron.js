const puppeteer = require('puppeteer');

async function startBrowser(headless = true) {
    const browser = await puppeteer.launch({
        headless: headless,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
    });
    const page = await browser.newPage();
    return { browser, page };
}

async function closeBrowser(browser) {
    return browser.close();
}


async function cloudloginandrenew() {
    const { browser, page } = await startBrowser(false);
    page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36');
     await page.setDefaultNavigationTimeout(0); 

    await page.goto("https://ccp.cloudaccess.net/index.php?rp=/login", {
              waitUntil: "networkidle2",
            });
    // await page.waitForNavigation();
    await page.click('#inputEmail');
    await page.keyboard.type('martmast60@gmail.com');
    await page.click('#inputPassword');
    await page.keyboard.type('@Anu123456');
    // await page.click('#login');
    // await page.waitForNavigation();

    await Promise.all([
        page.click('#login'),
        page.waitForNavigation({waitUntil: 'networkidle2'})
    ]);
    // await page.waitForSelector("#trials-table > tbody > tr > td:nth-child(5) > form > input.btn.btn-warning.js-show-upgrade-popup");

    await page.evaluate(() => {
        document.querySelector("#trials-table > tbody > tr > td:nth-child(5) > form > input.btn.btn-warning.js-show-upgrade-popup").click();
        setTimeout(() => {
            document.querySelector("#trials-table > tbody > tr > td:nth-child(5) > form > input.btn.btn-warning.js-show-upgrade-popup").click();
        },1500);
        
    });

    // await page.click(RENEW_BTN);
    // await page.click(RENEW_BTN, {delay: 3000});
    await page.waitForNavigation();
//  await page.waitForSelector('#show-notif > div > div > div.modal-body > h4');
    

    const ss = await page.screenshot({path: 'stat.png'});

    closeBrowser(browser);
}

cloudloginandrenew().then(console.log("OK"));
