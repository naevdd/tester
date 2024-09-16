const http = require('http'),
    fs = require('fs');

http.createServer(function(request, response){   
    fs.readFile('./index.html', function (err, html) {
        if (err) {
            throw err; 
        }      
        response.writeHead(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    })
}).listen(3000);
