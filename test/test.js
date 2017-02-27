'use strict';

var defsplit = require('..');

var test = require('tape'),
    remark = require('remark');

var fs = require('fs');


test(function (t) {
  var input = readInput('wonders/wonders'),
      output = readOutput('wonders/wonders');

  t.equal(process(input), output, 'extracts destinations');
  t.equal(process(output), output, 'idempotence');
  t.end();
});


test('identifier clashes', function (t) {
  t.equal(process(readInput('clash/different-sections')),
          readOutput('clash/different-sections'),
          'extracted definitions in different sections do not clash');
  t.equal(process(readInput('clash/other-definitions')),
          readOutput('clash/other-definitions'),
          'new-born definitions don\'t clash with existing ones');
  t.equal(process(readInput('clash/reuse')), readOutput('clash/reuse'),
          'reuse existing identifiers');
  t.equal(process(readInput('clash/object-prototype-props')),
          readOutput('clash/object-prototype-props'),
          'no clashes with Object.prototype property names');
  t.end();
});


test('options.id', function (t) {
  t.equal(process(readInput('options/id-multi'),
                  { id: ['travis-badge', 'travis'] }),
          readOutput('options/id-multi'), 'works with array of values');
  t.equal(process(readInput('options/id-single'), { id: 'travis-ci-0' }),
          readOutput('options/id-single'), 'works with a single value');
  t.equal(process(readInput('options/object-prototype-props'),
                  { id: ['__proto__', 'constructor'] }),
          readOutput('options/object-prototype-props'),
          'works with Object.prototype property names');
  t.end();
});


function process (src, opts) {
  return remark().use(defsplit, opts).processSync(src).toString();
}


function readInput (test) {
  return fs.readFileSync(dataFile(test), { encoding: 'utf8' });
}


function readOutput (test) {
  // Normalize style.
  return remark().processSync(fs.readFileSync(dataFile(test + '-output'),
                                        { encoding: 'utf8' })).toString();
}


function dataFile (test) {
  return __dirname + '/data/' + test + '.md';
}
