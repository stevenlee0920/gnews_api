import express from "express";
import axios from "axios";
import { configDotenv } from "dotenv";
import NodeCache from "node-cache";

configDotenv();
const router = express.Router();
const cache = new NodeCache({ stdTTL: 3600 });

// Middleware to check cache
const checkCache = (req, res, next) => {
    const { url } = req;
    if (cache.has(url)) {
        return res.json(cache.get(url));
    }
    next();
};

const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
const GNEWS_API_URL = process.env.GNEWS_API_URL;

// Fetch N news articles
router.get('/news', async (req, res) => {
    try {
        const { data } = await axios.get(`${GNEWS_API_URL}/top-headlines`, {
            params: {
                token: GNEWS_API_KEY,
                lang: 'en',
                max: req.query.max || 10,
            },
        });
        cache.set(req.url, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search news by keyword
router.get('/news/search/:search', checkCache, async (req, res) => {
    try {
        console.log("req: ", req.query);
        const { data } = await axios.get(`${GNEWS_API_URL}/search`, {
            params: {
                token: GNEWS_API_KEY,
                q: req.query.q,
                lang: 'en',
            },
        });
        cache.set(req.url, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search news by title
router.get('/news/title/:title', checkCache, async (req, res) => {
    try {
        console.log("req: ", req.query);
        const { data } = await axios.get(`${GNEWS_API_URL}/search`, {
            params: {
                token: GNEWS_API_KEY,
                q: req.query.q,
                in: "title",
                lang: 'en',
            },
        });
        cache.set(req.url, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;