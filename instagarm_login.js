'use strict';
const puppeteer = require('puppeteer');
const log = require('./connect');

const login = async function (username, password){
    const browser = await puppeteer.launch({
        headless: false,
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

    await page.waitForFunction('document.querySelectorAll("input").length===2');
    log.log("begin to input username and password")
    await page.keyboard.press('Tab', {delay: 100});
    await page.keyboard.type(username, {delay: 100})
    await page.keyboard.press('Tab', {delay: 100});
    await page.keyboard.type(password, {delay: 100})
    await page.keyboard.press('Tab', {delay: 100});
    await page.keyboard.press('Tab', {delay: 100});
    await page.keyboard.press('Enter', {delay: 100});
    log.log("navigate to new page (ask if save user info)")
    await page.waitForNavigation()
    await page.waitForFunction('document.querySelectorAll("button").length===3');
    await page.keyboard.press('Tab', {delay: 100});
    await page.keyboard.press('Tab', {delay: 100});
    await page.keyboard.press('Enter', {delay: 100});
    log.log("navigate to main page of current user")
    await page.waitForNavigation()
    const logout = await page.waitForXPath("/html/body/div[1]/section/nav/div[2]/div/div/div[3]/div/div[6]/div[2]/div[2]/div[2]/div/div/div/div/div/div/div",
        {hidden: true}
    )
    await page.waitForFunction(`document.querySelector("body > div > div > div > div > div > button").textContent === 'Turn On'`).then(()=>{
        page.keyboard.press('Tab', {delay: 100}).then(()=>{
            page.keyboard.press('Enter', {delay: 100}).then(()=>{
                log.log("turn on notifications")
            })
        })
    }).catch(()=>{
        log.log("No turn on notifications dialog")

    })
    log.log("login successfully")
    return page
};

// login("xxx","xxxx").then(r => {
//     console.log("ok")
// })

module.exports  = login
