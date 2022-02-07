'use strict';

const log = require('./connect');
const login = require('./instagarm_login');

const fetch_comments = async (username, password, url) => {
    const page = await login(username, password)

    await page.goto(url, {waitUntil: 'networkidle2'});

    log.log(`verify that the url is valid`)
    await page.waitForXPath("/html/body/div[1]/section/main/div/div[1]/article/div/div[2]/div/div[1]/div/header/div[2]/div[1]/div[2]/button",
        {hidden: false}
    )

    log.log(`intercept the response`)
    page.on('requestfinished', async request => {
        const url = request.url();
        if (url.search("https:\\/\\/i\\.instagram\\.com\\/api\\/v1\\/media\\/[\\d]*\\/comments\\/") === 0 &&
            request._method === "GET"
        ) {
            const test = await request.response().text();
            log.log(`URL: ${url} - JSON: ${test}`)
        }
    });

    log.log(`Find load more button`)
    await page.waitForFunction(`document.querySelector('svg[aria-label="Load more comments"]')!==null`)

    try {
        while (true) {
            await page.click('svg[aria-label="Load more comments"]')
            await page.waitForTimeout(1000)
            await page.waitForSelector('svg[aria-label="Load more comments"]')
            log.log(`to load more data`)
        }
    }catch (e) {
        if (await page.waitForSelector('svg[aria-label="Load more comments"]') === null) {
            log.log(`No more comment can be loaded`)
        }else{
            log.error("load more data error")
            throw e
        }
    }

    return page
};

// fetch_comments("xxx", "xxx", "https://www.instagram.com/p/CY-DPR-M678/").then(r => {
//     console.log("ok")
// })


module.exports  = fetch_comments