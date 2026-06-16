import https from 'https';

const url = 'https://backend.ascww.org/api/news';

https.get(url, (res) => {
    console.log(`Status: ${res.statusCode}`);
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(`Data length: ${data.length}`);
        if (data.length > 0) {
            console.log(data.substring(0, 200));
        }
    });
}).on('error', (err) => {
    console.error(`Error: ${err.message}`);
});
