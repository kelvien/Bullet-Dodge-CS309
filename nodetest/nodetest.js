var server = require('http');

server.createServer(function handler(req, res) {
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end('Hello World\n');
    
    
    }).listen(8080);