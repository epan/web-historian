var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var htmlFetcher = require('../workers/htmlfetcher');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(this.paths.list, 'utf8', function (err, data) {
    var urls = data.split('\n');
    return callback(urls);
  });
};

exports.isUrlInList = function(url, callback) {

  fs.readFile(this.paths.list, 'utf8', function (err, data) {
    var urls = data.split('\n');
    return callback(urls.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  // fs.readFile(this.paths.list, 'utf8', (err, data) => {
  //   var urls = data.split('\n');
  //   urls[urls.length - 1] = url;
  //   urls = urls.join('\n');
  // });
  fs.writeFile(this.paths.list, url, callback);
};

exports.isUrlArchived = function(url, callback) {
  var searchPath = `${this.paths.archivedSites}/${url}`;
  fs.stat(searchPath, (err, stats) => {
    return stats ? callback(true) : callback(false);
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach((url) => {
    htmlFetcher.fetch(url);
  });
};
