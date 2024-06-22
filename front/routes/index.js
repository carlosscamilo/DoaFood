var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('layout', { username: req.session.username, isLoginPage: true, body: 'pages/index', title: 'Express' });
});

module.exports = router;
