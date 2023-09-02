let express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
  res.render('landing/index', {authenticated: false, username: 'lucakrueger'});
})

router.get('/login', (req, res, next) => {
  res.render('landing/login', {title: 'Login'});
})

router.get('/register', (req, res, next) => {
  res.render('landing/register', {title: 'Register'});
})

router.get('/account/:username', (req, res, next) => {
  res.render('landing/account', {title: req.params.username});
})

router.get('/reset/:token', (req, res, next) => {
  res.render('landing/reset', {title: 'Reset Password'});
})

module.exports = router;
