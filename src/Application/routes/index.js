var express = require('express');
var router = express.Router();
var ArticleProvider = require('./articleprovider-memory').ArticleProvider;

var articleprovider = new ArticleProvider();
articleprovider.watchFiles(function(){});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Home' });
});
router.get('/blog', function(req, res) {
	articleprovider.findAll(function(error, articles){
		res.render('blog-list', {
			title: 'Blog',
			articles: articles
		} );
	});
});
router.get('/blog/:id', function(req, res) {
	articleprovider.findById(req.params.id, function(error, post){
		res.render('blog-list', {
			title: 'Blog',
			articles: [post]
		});
	});
});
router.get('/products', function(req, res) {
	res.render('product-list', { title: 'Products'} );
});
router.get('contact', function(req, res) {
	res.render('contact', { title: 'Contact'} );
});
router.get('basket', function(req, res) {
	res.render('basket', { title: 'Basket'} );
});

module.exports = router;