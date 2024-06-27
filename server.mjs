import express from 'express';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the 'public' directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/run-audit', async (req, res) => {
    const url = req.query.url;
    if (!url) {
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

// Listen on all network interfaces
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${port}`);
});
