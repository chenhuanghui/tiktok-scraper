const express = require("express");
const { scrapeTikTokProduct } = require("./index");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable trust proxy for apps behind reverse proxies (e.g., Railway, Heroku)
app.set("trust proxy", 1);

// Apply rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
    message: { error: "Too many requests, please try again later." },
});
app.use(limiter);

// Health check endpoint
app.get("/", (req, res) => {
    res.status(200).send("Server is running.");
});

// Scraper API endpoint
app.get("/scrape", async (req, res) => {
    const productId = req.query.productId;

    if (!productId) {
        return res.status(400).json({ error: "Missing productId parameter" });
    }

    try {
        const data = await scrapeTikTokProduct(productId); // Call the scraper function
        return res.json(data); // Return scraped data as JSON
    } catch (err) {
        console.error("Error scraping product:", err.message);
        return res.status(500).json({ error: "Failed to scrape product", details: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ error: "An unexpected error occurred." });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});