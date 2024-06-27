import express from 'express';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import cors from 'cors';
import path from 'path';
import favicon from 'serve-favicon';

const app = express();

// Use the CORS middleware
app.use(cors());

// Serve a default favicon to avoid errors
const __dirname = path.resolve();
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// Root route to verify the server is running
app.get('/', (req, res) => {
    res.send('Lighthouse Audit Server is running');
});

app.get('/run-audit', async (req, res) => {
    const url = req.query.url;
    console.log(`Received audit request for URL: ${url}`);

    if (!url) {
        console.log('No URL provided');
        res.status(400).send('URL is required');
        return;
    }

    try {
        console.log(`Starting Lighthouse audit for URL: ${url}`);
        
        const chrome = await launch({
            chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
        });
        const options = { logLevel: 'info', output: 'json', port: chrome.port };
        const runnerResult = await lighthouse(url, options);
        
        await chrome.kill();
        
        const reportJson = runnerResult.lhr;
        console.log('Lighthouse audit completed successfully.');
        res.json(reportJson);
    } catch (error) {
        console.error('Error during Lighthouse audit:', error);
        res.status(500).send(`Error running Lighthouse: ${error.message}`);
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export default app;
