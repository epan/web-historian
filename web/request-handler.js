var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!
const fs = require('fs');

exports.handleRequest = function (req, res) {
  console.log(`Serving ${req.method} for ${req.url}`);

  if (req.url === '/') {

    if (req.method === 'GET') {
      httpHelpers.serveAssets(res, '/public/index.html');
    }

    if (req.method === 'POST') {
      var body = '';
      req.on('data', (chunk) => {
        body += chunk;
      })
      .on('end', () => {
        var url = `${body.slice(4)}\n`;
        archive.addUrlToList(url, () => {
          res.writeHead(302, httpHelpers.headers);
          res.end();
        });
      });
    }

  } else if (req.method === 'GET') {
    httpHelpers.serveAssets(res, `../archives/sites${req.url}`);

  } else {
    res.end(archive.paths.list);
  }

};
