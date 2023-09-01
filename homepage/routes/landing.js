let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.render('landing/index', {authenticated: true, username: 'lucakrueger'});
})

router.get('/login', function(req, res, next) {
  res.render('landing/login', {title: 'Login'});
})

router.get('/register', function(req, res, next) {
  res.render('landing/register', {title: 'Register'});
})

router.get('/reset', function(req, res, next) {
  res.render('landing/reset', {title: 'Reset Password'});
})

module.exports = router;
