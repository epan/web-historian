var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var htmlFetcher = require('../workers/htmlfetcher');
var httpHelpers = require('../web/http-helpers');

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
    callback(urls);
  });
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(this.paths.list, 'utf8', function (err, data) {
    console.log(`URL IN sites.txt?: ${data.includes(url)}`);
    callback(data.includes(url));
  });
};

exports.addUrlToList = function(url, callback) {
  fs.readFile(this.paths.list, 'utf8', (err, data) => {
    var urls = data.split('\n');
    urls[urls.length - 1] = url;
    urls = urls.join('\n');
    fs.writeFile(this.paths.list, urls, callback);
  });
};

exports.isUrlArchived = function(url, callback) {
  var searchPath = `${this.paths.archivedSites}/${httpHelpers.removeLineBreak(url)}`;
  console.log('HELPER URL ARCHIVED SEARCH PATH IS: ', searchPath);
  fs.stat(searchPath, (err, stats) => {
    !err ? callback(true) : callback(false);
  });
};

exports.downloadUrls = function(urls) {
  urls.forEach((url) => {
    htmlFetcher.fetch(url);
  });
};

exports.removeLineBreak = function(string) {
  if (string[string.length] === '\n') {
    return string.substr(0, string.length - 1);
  } else {
    return string;
  }
};
