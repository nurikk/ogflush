#! /usr/bin/env node
var request = require('request');
var fs = require('fs');

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

var _q = function(url, params, log_name){
  request({url: url, qs: params}, function(err, response, body) {
    if(err) { console.log(err); return; }
  });
}
var flushFb = function (url) {
  _q('https://graph.facebook.com/', {
    id: url,
    scrape: true
  }, url);
};

var flushVK = function (url) {
  _q('https://api.vk.com/method/pages.clearCache', {
    url: url
  }, url);
};

urls.forEach(function(url){
  flushFb(url);
  flushVK(url);
  console.log('ok', url);
});
