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

        console.log('Lighthouse audit result:', runnerResult);
        
        await chrome.kill();
        
        const reportJson = runnerResult.lhr;
        console.log('Lighthouse audit completed successfully.');
        res.json(reportJson);
    } catch (error) {
        console.error('Error during Lighthouse audit:', error);
        res.status(500).send(`Error running Lighthouse: ${error.message}`);
    }
});
