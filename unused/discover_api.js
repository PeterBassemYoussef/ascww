import https from 'https';

const endpoints = [
    'https://backend.ascww.org/api/services',
    'https://backend.ascww.org/api/home',
    'https://backend.ascww.org/api/slider',
    'https://ascww.org/api/services'
];

endpoints.forEach(url => {
    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`\n--- Response from ${url} ---`);
            console.log("Status:", res.statusCode);
            if (res.statusCode === 200) {
                try {
                    // Log first 500 chars to see structure
                    console.log(data.substring(0, 500));
                } catch (e) {
                    console.log("Not JSON:", data.substring(0, 100));
                }
            }
        });
    }).on('error', (e) => {
        console.log(`Error fetching ${url}:`, e.message);
    });
});
