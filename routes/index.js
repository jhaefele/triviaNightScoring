// var express = require('express');
// var router = express.Router();
const logger = require('../logger')



/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = app => {
  require('./games')(app)
  require('./teams')(app)
  require('./round-scores')(app)
}
