'use strict';
const puppeteer = require('puppeteer');
const log = require('../lib/connect');

const login = async function (username, password){
    const browser = await puppeteer.launch({
        headless: true,
        args: [],
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 800,
        height: 800,
        deviceScaleFactor: 1,
    });

    log.log(`start a chrome and open a page`)
    await page.goto('https://www.instagram.com/');
    log.log(`https://www.instagram.com/`)

    log.log("Test")
    log.log("Test")
    log.log("Test")
    return 0
};

// login("xxx","xxxx").then(r => {
//     console.log("ok")
// })

module.exports  = login
