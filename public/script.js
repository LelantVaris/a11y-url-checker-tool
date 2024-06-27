document.getElementById('runAuditButton').addEventListener('click', async function() {
    const url = document.getElementById('urlInput').value;
    if (!url) {
        logMessage('Please enter a URL.');
        return;
    }
    
    logMessage(`Running audit for ${url}...`);
    
    try {
        const response = await fetch(`/run-audit?url=${encodeURIComponent(url)}`);
        if (!response.ok) {
            throw new Error('Failed to run audit');
        }
        
        const auditResult = await response.json();
        logMessage('Audit complete.');
        document.getElementById('viewResultsButton').classList.remove('hidden');
        
        localStorage.setItem('auditResult', JSON.stringify(auditResult));
    } catch (error) {
        logMessage(`Error: ${error.message}`);
        console.error('Error during audit:', error); // Additional logging for debugging
    }
});

document.getElementById('viewResultsButton').addEventListener('click', function() {
    window.location.href = `results.html?url=${encodeURIComponent(document.getElementById('urlInput').value)}`;
});

function logMessage(message) {
    const logDiv = document.getElementById('logMessages');
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    logDiv.appendChild(messageDiv);
}
