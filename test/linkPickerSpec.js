const assert = require("assert");
const {Builder, By, Key, until} = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const path = require('path');

const testPage = path.resolve(__dirname, 'test-page.html');
const linkPickerSelector = By.className("keyn-link-picker");

describe("link-picker", function() {
    this.timeout(5000); // Takes time to start the browser

    var driver;
    // const driver = await new Builder().forBrowser("firefox").setFirefoxOptions(options).build();
    before("setup browser", async function() {
        let options = new firefox.Options();
        options.headless();
        driver = await new Builder().forBrowser("firefox").setFirefoxOptions(options).build();
    });


    it("should display link picker hints", async function() {
        await navigateToTopPage();

        await activateLinkPicker();

        await driver.wait(until.elementLocated(linkPickerSelector), 1000);
    });

    it("select link by filtering and accepting", async function() {
        await navigateToTopPage();
        await activateLinkPicker();

        // "b" is only contained in one of the two links
        await driver.actions().sendKeys("b", Key.ENTER).perform();

        await driver.wait(until.titleIs("Test Page B"));
    });

    it("can navigate to first test page", async function() {
        await navigateToTopPage();
        await activateLinkPicker();

        // the first link is for page "A"
        await driver.actions().sendKeys(Key.ENTER).perform();

        await driver.wait(until.titleIs("Test Page A"));
    });

    it("can cancel link-picker", async function() {
        await navigateToTopPage();
        await activateLinkPicker();
        // assert that before our action the picker is present
        await driver.wait(until.elementLocated(linkPickerSelector));

        await driver.actions().sendKeys(Key.ESCAPE).perform();

        await driver.wait(untilNotFound(linkPickerSelector), 1000);
    });

    afterEach("clear contest", async function() {
        if (typeof driver !== 'undefined') {
            await driver.navigate().refresh();
        }
    })

    after("shut down browser", async function() {
        if (typeof driver !== 'undefined') {
            await driver.quit();
        }
    });

    async function navigateToTopPage() {
        await driver.get(`file:///${testPage}`);
        await driver.wait(until.titleIs("Test Page"), 1000);
    }

    function untilNotFound(selector) {
        return async function(d) {
            let remainingPickers = await d.findElements(selector);
            return remainingPickers.length == 0;
        }
    }

    /**
     * The browser extension is normally responsible for injecting this script
     * in response to keyboard shortcut from the user.
     */
     async function activateLinkPicker() {

        await driver.executeScript(`
            let alreadyLoaded = false;
            for (let c of document.head.children) {
                if (c.tag == 'script' && c.src.indexOf("link-picker.js") > -1) {
                    alreadyLoaded = true;
                }
            }
            if (!alreadyLoaded) {
                let scr = document.createElement('script');
                scr.type = 'text/javascript';
                scr.src = '${path.resolve(__dirname, "..", "js", "link-picker.js")}';
                document.head.appendChild(scr);
            }
        `);
        await driver.wait(async function (d) {
            return await d.executeScript("return typeof _keyn_activate_link_picker !== 'undefined';");
        }, 1000);

        await driver.executeScript("_keyn_activate_link_picker();");
    }
})