var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ message: 'Bem-vindo a minha aplicação' });
});

module.exports = router;
