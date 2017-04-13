var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
const fs = require('fs');

exports.handleRequest = function (req, res) {
  console.log(`Serving ${req.method} for ${req.url}`);

  if (req.method === 'GET' && req.url === '/') {
    console.log('PATH EXPECTED TO BE: ', __dirname + './public/index.html')
    fs.readFile(__dirname + '/public/index.html', (err, data) => {
      if (err) {
        res.writeHead(404,{"Content-type":"text/plain"});
        res.end("Sorry the page was not found");
      } else {
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.end(data)
      }
    })

  } else {
    res.end(archive.paths.list);
  }

};
