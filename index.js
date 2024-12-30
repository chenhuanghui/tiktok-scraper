const { chromium } = require("playwright");
// const { chromium } = require('playwright-extra');
// const stealth = require('playwright-extra-plugin-stealth');
// chromium.use(stealth());

async function scrapeTikTokProduct(productId) {
    const url = `https://www.tiktok.com/view/product/${productId}`;
    // const url = `https://shop.tiktok.com/view/product/1729789070155025084`;

    // const browser = await chromium.launch({ headless: false }); // Use headless: false for debugging
    const browser = await chromium.launch({ headless: true }); // Use headless: true for production
    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        viewport: { width: 1920, height: 1080 },
    });
    const page = await context.newPage();
    const pageContent = await page.content();
    console.log(pageContent);

    try {
        // Navigate to the product page
        await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

        // Wait for the title element to appear
        await page.waitForSelector('xpath=//*[@id="root"]/div/div[3]/div[1]/div[2]/div/div[4]', { timeout: 60000 });

        // Extract the title
        const titleHandle = page.locator('xpath=//*[@id="root"]/div/div[3]/div[1]/div[2]/div/div[4]');
        const title = await titleHandle.innerText();
        console.log("Title:", title);

        // Wait for the parent div containing images
        await page.waitForSelector('xpath=//*[@id="root"]/div/div[3]/div[1]/div[1]/div/div/div', { timeout: 60000 });

        // Locate the parent div and extract image URLs from child <img> tags
        const imageParentDiv = page.locator('xpath=//*[@id="root"]/div/div[3]/div[1]/div[1]/div/div/div');
        const imageUrls = await imageParentDiv.locator("img").evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src")));

        console.log("Image URLs:", imageUrls);


		// Wait for the price element to appear
        await page.waitForSelector('xpath=//*[@id="root"]/div/div[3]/div[1]/div[2]/div/div[1]/div/span', { timeout: 60000 });

        // Extract the price
        const priceHandle = page.locator('xpath=//*[@id="root"]/div/div[3]/div[1]/div[2]/div/div[1]/div/span');
        const price = await priceHandle.innerText();
        console.log("Price:", price);


		// Wait for the parent description div to appear
        await page.waitForSelector('xpath=//*[@id="root"]/div/div[3]/div[1]/div[9]', { timeout: 60000 });

        // Locate the parent description div and extract content
        const descriptionHandle = page.locator('xpath=//*[@id="root"]/div/div[3]/div[1]/div[9]');
        const description = await descriptionHandle.innerText();
        console.log("Description:", description);

        return { title, imageUrls, price, description };
    } catch (err) {
        console.error("Error scraping product title:", err);
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeTikTokProduct };
