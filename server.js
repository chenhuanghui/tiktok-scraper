const rateLimit = require("express-rate-limit");
const express = require("express");
const { scrapeTikTokProduct } = require("./index"); // Assuming your scraper logic is in a separate file

require("dotenv").config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000; // Use PORT from Railway or default to 3000

// Apply Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { error: "Too many requests, please try again later." }, // Custom response for rate-limited requests
});
app.use(limiter);

app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ error: "An unexpected error occurred." });
});

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