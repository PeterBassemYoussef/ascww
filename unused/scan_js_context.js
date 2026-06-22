import https from 'https';

const url = 'https://ascww.org/js/app.0cb34e9e.js';

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        // Look for image paths in the JS bundle with context
        // We escape the dot in regex to match specific extensions
        const imgRegex = /([^"'{}:,]{0,100})["'](img\/[^"']+\.(png|jpg|jpeg|gif|svg|webp))["']([^"'{}:,]{0,100})/g;
        let match;

        console.log("--- Images with Context ---");
        while ((match = imgRegex.exec(data)) !== null) {
            // match[1] = text before
            // match[2] = image path
            // match[4] = text after
            // We clean up newlines for readability
            const context = (match[1] + " [IMG] " + match[4]).replace(/[\r\n]+/g, ' ');
            console.log(`PATH: ${match[2]}`);
            console.log(`CTX:  ${context}\n`);
        }
    });
}).on('error', (e) => {
    console.error("Error:", e.message);
});
