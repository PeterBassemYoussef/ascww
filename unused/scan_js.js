import https from 'https';

const url = 'https://ascww.org/js/app.0cb34e9e.js';

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        // Look for image paths in the JS bundle
        const imgRegex = /["']([^"']+\.(png|jpg|jpeg|gif|svg|webp))["']/g;
        let match;
        const found = new Set();

        while ((match = imgRegex.exec(data)) !== null) {
            if (!found.has(match[1])) {
                console.log("Found:", match[1]);
                found.add(match[1]);
            }
        }
    });
}).on('error', (e) => {
    console.error("Error:", e.message);
});
