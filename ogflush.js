#! /usr/bin/env node
var request = require('request');
var fs = require('fs');
var simplyWait = require('simply-wait');

var argv = require('minimist')(process.argv.slice(2));

var urls = [];
if(argv.u){
  urls.push(argv.u);
}
if(argv.f) {
  var _file = fs.readFileSync(argv.f, {encoding: 'utf8'});
  urls = urls.concat(_file.split("\n"));
}
urls = urls.filter(function(u){return !!u});
if(urls.length === 0){
  console.log('Usage');
  console.log('ogflush -u http://some.url/');
  console.log('ogflush -f file.txt');
}

var _q = function(url, params, log_name, cb) {
  request({url: url, qs: params}, function(err, response, body) {
    if(err) { console.log(err); return; }
    cb();
  });
}
var flushFb = function (url, cb) {
  _q('https://graph.facebook.com/', {
    id: url,
    scrape: true
  }, url, cb);
};

var flushVK = function (url, cb) {
  _q('https://api.vk.com/method/pages.clearCache', {
    url: url
  }, url, cb);
};

urls.forEach(function(url){
  var wait = simplyWait(function (err) {
    console.log('done', url);
  });

  flushFb(url, wait());
  flushVK(url, wait());
});
