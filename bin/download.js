#!/usr/bin/env node

// Based on https://github.com/dominictarr/readme/blob/4d862ac25c6a918a81bbdaabfddc60f0c12ea101/bin/download.js
// License: BSD

var coredocs = require('node-api-docs');
var jsonstream = require('JSONStream');
var through = require('through2');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');

var coredir = path.join(__dirname, '../core');
mkdirp.sync(coredir);

console.log('Downloading core docs for offline use...');

coredocs.json('index')
  .pipe(jsonstream.parse(['desc', true, 'text']))
  .pipe(through.obj(function (text, enc, next) {
    var m = /^\[[^\]]+\]\((\S+)\.html\)$/.exec(text);
    if (!m) return next();
    if (m[1] === 'documentation' || m[1] === 'synopsis') return next();
    var file = m[1] + '.json';
    console.log('Downloading:' + file);
    coredocs.json(m[1])
      .pipe(fs.createWriteStream(path.join(coredir, file)));
    next();
  }));

// Don't abort install if this fails.
process.on('uncaughtException', function (err) {
  console.error(err.toString());
});
