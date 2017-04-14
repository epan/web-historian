var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!
const fs = require('fs');
var _ = require('underscore');

exports.handleRequest = function (req, res) {
  console.log(`Serving ${req.method} for ${req.url}`);

  if (req.url === '/') {
    if (req.method === 'GET') {
      httpHelpers.serveAssets(res, `${archive.paths.siteAssets}/index.html`);
    }

    if (req.method === 'POST') {
      var body = '';
      req.on('data', (chunk) => {
        body += chunk;
      })
      .on('end', () => {
        // format the url as text to save to file
        var url = `${body.slice(4)}`;

        //check if url in our archive (sites.txt)
        archive.isUrlArchived(url, (isArchived) => {
          if (isArchived) {
            var searchPath = `${archive.paths.archivedSites}/${url}`;
            httpHelpers.serveAssets(res, searchPath);
          } else {
            archive.isUrlInList(url, (isInList) => {
              if (!isInList) {
                archive.addUrlToList(`${url}\n`, () => {
                  res.writeHead(302, httpHelpers.headers);
                  res.end();
                });
              }
            });
          }
        });

      });
    }

  } else if (req.url === '/styles.css') {
    if (req.method === 'GET') {
      httpHelpers.serveAssets(res, `${archive.paths.siteAssets}/styles.css`);
    }

  } else if (req.method === 'GET') {
    console.log('entering the GET FUNCTION ==== ', req.url);
    fs.readFile(`${archive.paths.archivedSites}${req.url}`, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(404, 'Not Found', {'Content-type': 'text/plain'});
        res.end(`A GET Could not find: ${archive.paths.archivedSites}${req.url}`);
      } else {
        res.writeHead(200);
        res.end(data);
      }
    });

  } else {
    res.writeHead(404, 'Not Found', {'Content-type': 'text/plain'});
    res.end();
  }

};
