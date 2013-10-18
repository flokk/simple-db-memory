/**
 * Module dependencies
 */

var uuid = require('uuid').v4;
var debug = require('debug')('simple-db-memory');

/**
 * Keep an in memory list of buckets
 */

var buckets = {};

/**
 * Implement the database in memory
 */

var db = exports;

db.buckets = function(cb) {
  debug('buckets');
  cb(null, {data: Object.keys(buckets)});
};

db.count = function(id, cb) {
  debug('count', id);
  getBucket(id, function(bucket) {
    cb(null, {data: Object.keys(bucket).length});
  });
};

db.keys = function(id, cb) {
  debug('keys', id);
  getBucket(id, function(bucket) {
    cb(null, {data: Object.keys(bucket)});
  });
};

db.get = function(id, key, cb) {
  debug('get', id, key);
  getBucket(id, function(bucket) {
    cb(null, {data: clone(bucket[key])});
  });
};

db.post = function(id, body, cb) {
  debug('post', id, body);
  getBucket(id, function(bucket) {
    var key = uuid();
    bucket[key] = clone(body);
    cb(null, {key: key});
  }, true);
};

db.put = function(id, key, body, cb) {
  debug('put', id, key, body);
  getBucket(id, function(bucket) {
    bucket[key] = clone(body);
    cb(null, {});
  }, true);
};

db.remove = function(id, key, cb) {
  debug('remove', id, key);
  getBucket(id, function(bucket) {
    delete bucket[key];
    cb(null, {});
  });
};

db.exists = function(id, key, cb) {
  debug('exists', id, key);
  getBucket(id, function(bucket) {
    cb(null, {data: typeof bucket[key] !== 'undefined'});
  });
};

function getBucket(id, cb, create) {
  var bucket = buckets[id];
  if (create && !bucket) bucket = buckets[id] = {};
  cb(bucket || {});
}

function clone(data) {
  return typeof data !== 'undefined' ? JSON.parse(JSON.stringify(data)) : null;
}
