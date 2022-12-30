const   http = require('http'), //HTTP server
        express = require('express'), //Handling HTTP requests & routing
        fs = require('fs'), //File system functionalities
        xmlParse = require('xslt-processor').xmlParse, //XML handling
        xsltProcess = require('xslt-processor').xsltProcess, //XSLT handling
        router = express(), //Init our router
        server = http.createServer(router); //Init our server

router.get('/', function(req, res) {

    res.writeHead(200, {'Content-Type' : 'text/html'});

    let xml = fs.readFileSync('list.xml', 'utf8'),
        xsl = fs.readFileSync('list.xsl', 'utf8');

    xml = xmlParse(xml);
    xsl = xmlParse(xsl);

    let html = xsltProcess(xml, xsl);

    res.end(html.toString());
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    const addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port)
});