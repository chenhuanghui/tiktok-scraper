const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

async function scrapeTikTokProduct(productId) {
    const url = `https://www.tiktok.com/view/product/${productId}`;
    let driver;

    try {
        // Initialize the Selenium WebDriver with Chrome
        const options = new chrome.Options(); // Correctly instantiate Chrome options
        options.addArguments("--headless", "--disable-gpu", "--no-sandbox", "--disable-dev-shm-usage");

        driver = await new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();

        // Navigate to the product page
        console.log(`Navigating to URL: ${url}`);
        await driver.get(url);

        // Wait for the title element to load
        const titleElement = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="root"]/div/div[3]/div[1]/div[2]/div/div[4]')),
            30000
        );
        const title = await titleElement.getText();

        // Wait for and extract images
        const imageElements = await driver.findElements(By.xpath('//*[@id="root"]/div/div[3]/div[1]/div[1]/div/div/div//img'));
        const imageUrls = [];
        for (const img of imageElements) {
            const src = await img.getAttribute("src");
            imageUrls.push(src);
        }

        // Wait for and extract price
        const priceElement = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="root"]/div/div[3]/div[1]/div[2]/div/div[1]/div/span')),
            30000
        );
        const price = await priceElement.getText();

        // Wait for and extract description
        const descriptionElement = await driver.wait(
            until.elementLocated(By.xpath('//*[@id="root"]/div/div[3]/div[1]/div[9]')),
            30000
        );
        const description = await descriptionElement.getText();

        // Return the extracted data
        return { title, imageUrls, price, description };
    } catch (err) {
        console.error("Error scraping product:", err.message);
        throw new Error("Failed to scrape TikTok product.");
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}

module.exports = { scrapeTikTokProduct };