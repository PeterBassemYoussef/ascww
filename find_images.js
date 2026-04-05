import https from 'https';

const url = 'https://ascww.org/';

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => { data += chunk; });
    res.on('end', () => {
        // Regex to find image sources
        const imgRegex = /<img[^>]+src="([^"]+)"/g;
        const styleRegex = /url\(['"]?([^'"]+)['"]?\)/g;

        let match;
        console.log("--- Images Found ---");
        while ((match = imgRegex.exec(data)) !== null) {
            console.log("IMG MATCH:", match[1]);
        }

        while ((match = styleRegex.exec(data)) !== null) {
            console.log("BG MATCH:", match[1]);
        }

        // Also look for likely image paths in text
        // Only alphanumeric and common image extensions
        const pathRegex = /[\w\-\/]+\.(png|jpg|jpeg|gif|svg|webp)/g;
        const allMatches = data.match(pathRegex);
        if (allMatches) {
            console.log("\n--- Possible Image Paths ---");
            allMatches.forEach(item => {
                if (item.length > 5 && !item.includes('node_modules')) {
                    console.log("PATH:", item);
                }
            });
        } else {
            console.log("No path matches found.");
        }

    });
}).on('error', (e) => {
    console.error("Error:", e.message);
});
