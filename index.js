const { chromium } = require("playwright");

async function scrapeTikTokProduct(productId) {
    const url = `https://www.tiktok.com/view/product/${productId}`;

    // Launch browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        viewport: { width: 1920, height: 1080 },
        javaScriptEnabled: true,
    });

    // Apply stealth techniques manually
    context.addInitScript(() => {
        Object.defineProperty(navigator, "webdriver", {
            get: () => false,
        });
    });

    context.addInitScript(() => {
        window.chrome = { runtime: {} };
    });

    const page = await context.newPage();

    try {
        console.log(`Navigating to URL: ${url}`);
        await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });

        console.log("Page loaded. Extracting data...");

        // Extract the title
        const titleHandle = await page.locator('xpath=//*[@id="root"]/div/div[3]/div[1]/div[2]/div/div[4]');
        const title = await titleHandle.innerText();

        // Extract images
        const imageParentDiv = await page.locator('xpath=//*[@id="root"]/div/div[3]/div[1]/div[1]/div/div/div');
        const imageUrls = await imageParentDiv.locator("img").evaluateAll((imgs) =>
            imgs.map((img) => img.getAttribute("src"))
        );

        // Extract the price
        const priceHandle = await page.locator('xpath=//*[@id="root"]/div/div[3]/div[1]/div[2]/div/div[1]/div/span');
        const price = await priceHandle.innerText();

        // Extract the description
        const descriptionHandle = await page.locator('xpath=//*[@id="root"]/div/div[3]/div[1]/div[9]');
        const description = await descriptionHandle.innerText();

        return { title, imageUrls, price, description };
    } catch (err) {
        console.error("Error scraping product:", err.message);
        throw new Error("Failed to scrape TikTok product.");
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeTikTokProduct };