let express = require('express');
let router = express.Router();

router.get('/api/login', (req, res, next) => {
  res.render('landing/index', {});
})

module.exports = router;
