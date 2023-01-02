const   http = require('http'), //HTTP server
        path = require('path'),
        express = require('express'), //Handling HTTP requests & routing
        fs = require('fs'), //File system functionalities
        xmlParse = require('xslt-processor').xmlParse, //XML handling
        xsltProcess = require('xslt-processor').xsltProcess, //XSLT handling
        router = express(), //Init our router
        xml2js = require('xml2js'),
        server = http.createServer(router); //Init our server
        
        // Serve static files and parse request bodies
        router.use(express.static(path.resolve(__dirname,'views')));
        router.use(express.urlencoded({extended: true}));
        router.use(express.json());

// Converts an XML file to a JSON object
function XMLtoJSON(filename, cb){
    let filepath = path.normalize(path.join(__dirname, filename));
    fs.readFile(filepath, 'utf8', function(err, xmlStr){
        if (err) throw (err);               
        xml2js.parseString(xmlStr, {}, cb);
    });
};

// Converts a JSON object to an XML file
function JSONtoXML(filename, obj, cb){
    let filepath = path.normalize(path.join(__dirname, filename));
    let builder = new xml2js.Builder();
    let xml = builder.buildObject(obj);
    fs.unlinkSync(filepath);
    fs.writeFile(filepath, xml, cb);
};

// GET route for serving an HTML page generated from an XML and XSL file
router.get('/get/html', function(req, res) {

        // Set response type to HTML
    res.writeHead(200, {'Content-Type' : 'text/html'});
    
    // Read XML and XSL files
    let xml = fs.readFileSync('list.xml', 'utf8'),
        xsl = fs.readFileSync('list.xsl', 'utf8');

    xml = xmlParse(xml);
    xsl = xmlParse(xsl);   
    
    // Apply XSL transformation to XML and convert to string
    let html = xsltProcess(xml, xsl);
    // Send HTML response
    res.end(html.toString());
});

// POST route for appending data to an XML file in JSON format

router.post('/post/json', function(req, res){
    function appendJSON(obj){
        console.log(obj);
        // Read XML file and convert to JSON
        XMLtoJSON('list.xml', function(err, result) {
            if (err) throw (err);
            result.list.priority[obj.sec_n].task.push({'Description': obj.Description, 'Due': obj.Due});
            console.log(JSON.stringify(result, null, " "));
                    // Convert modified JSON object back to XML and write to file
            JSONtoXML('list.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };
// Read request body and append to XML file
    appendJSON(req.body);
// Redirect back to previous page
    res.redirect('back');
});

// POST route for deleting an element from an XML file
router.post('/post/delete', function (req,res) {
    function deleteJSON(obj) {
        console.log(obj);
        XMLtoJSON('list.xml', function(err, result){
            if (err) throw (err);

            delete result.list.priority[obj.section].task[obj.entree];

            JSONtoXML('list.xml', result, function(err){
                if (err) console.log(err);
            });
        });
    };

    deleteJSON(req.body);

    res.redirect('back');
})
// Start HTTP server and listen for requests
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
    const addr = server.address();
    console.log("Server listening at", addr.address + ":" + addr.port)
});