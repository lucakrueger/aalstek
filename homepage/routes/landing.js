let express = require('express')
let router = express.Router()
let passport = require('passport')

router.get('/', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        res.render('landing/index', {
            authenticated: user != false,
            username: user != false ? user.username : '',
        })

    })(req, res, next)
})

router.get('/login', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if(user == false) {
            res.render('landing/login', { title: 'Login' })
            return
        }

        res.redirect('http://localhost:3000')

    })(req, res, next)
})

router.get('/register', (req, res, next) => {
    res.render('landing/register', { title: 'Register' })
})

router.get('/account/:username', (req, res, next) => {
    res.render('landing/account', { title: req.params.username })
})

router.get('/reset/:token', (req, res, next) => {
    res.render('landing/reset', { title: 'Reset Password' })
})

module.exports = router
