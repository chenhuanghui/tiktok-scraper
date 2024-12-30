const express = require("express");
const { scrapeTikTokProduct } = require("./index"); // Assuming the above code is in 'index.js'

const app = express();
const PORT = process.env.PORT || 3000;

// API Endpoint to call the scraper
app.get("/scrape", async (req, res) => {
    const productId = req.query.productId;

    if (!productId) {
        return res.status(400).json({ error: "Missing productId parameter" });
    }

    try {
        const data = await scrapeTikTokProduct(productId); // Call your scraping function
        return res.json(data); // Return the scraped data as JSON
    } catch (error) {
        console.error("Error in scraping:", error);
        return res.status(500).json({ error: "Failed to scrape product", details: error.message });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});