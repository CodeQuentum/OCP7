const http = require('http');

const server = http.createServer((req, res) => {
    res.end('voila le reponse');
});

server.listen(process.env.PORT || 3000);