// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var http = require('http');
var archive = require('../helpers/archive-helpers');
var handler = require('../web/request-handler');
var fs = require('fs');

exports.fetch = function (url) {
  http.get({'hostname': url}, (res) => {
    var content = '';
    res.on('data', (chunk) => {
      content += chunk;
    });
    res.on('end', () => {
      fs.writeFile(`${archive.paths.archivedSites}/${url}`, content, () => {});
    });
  });
};
