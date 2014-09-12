var monk = require('monk');
var db = monk('localhost:27017/node-blog');
var fs = require('fs');
var forEach = require('async-foreach').forEach;
var watch = require('node-watch');
var YamlHeaderReader = require('./yaml-header-reader').YamlHeaderReader;

var yamlHeaderReader = new YamlHeaderReader();
var pageSize = 10;

ArticleProvider = function(){
};

ArticleProvider.prototype.getCollection = function(callback) {
  var collection = db.get('articles');
  callback(collection);
};

ArticleProvider.prototype.watchFiles = function(callback) {
  var self = this;
  self.parseAllFiles(function(){
    watch('/posts', function(filename){
      self.parseFile(filename, callback);
    });
  });
};

ArticleProvider.prototype.parseAllFiles = function(callback) {
  var self = this;
  fs.readdir('./posts', function(error, files){
    forEach(files, function(file) {
      self.parseFile(file, function() {});
    }, function(){
      callback();
    });
  });
};

ArticleProvider.prototype.parseFile = function(filename, callback) {
  var self = this;
  yamlHeaderReader.splitData(fs.readFileSync('./posts/' + filename, 'utf8'), function(data) {
    data._id = filename.substring(11, filename.length - 3);
    self.save(data, function(error, result){
      callback(null, result);
    });
  });
};

ArticleProvider.prototype.save = function(article, callback) {
  this.getCollection(function(error, article_collection) {
    if (error) callback(error)
    else {
      var promise = article_collection.insert(article);
      promise.error(function(error){
        console.log(error);
      });
      promise.success(function(doc){
        callback(null, doc);
      })
    }
  });
};

ArticleProvider.prototype.findAll = function(callback) {
  this.getCollection(function(error, article_collection) {
    if (error) callback(error);
    else {
      var promise = article_collection.find();
      promise.error(function(error){
        console.log(error);
      });
      promise.success(function(docs){
        callback(null, docs);
      });
    }
  });
};

ArticleProvider.prototype.findById = function(id, callback) {
  this.getCollection(function(error, article_collection) {
    if (error) callback(error);
    else {
      var promise = article_collection.findById(id);
      promise.error(function(error){
        console.log(error);
      });
      promise.success(function(doc){
        callback(null, doc);
      });
    }
  });
};

exports.ArticleProvider = ArticleProvider;