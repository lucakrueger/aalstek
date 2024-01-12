let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
let hbs = require('hbs')
let passport = require('passport')
let LocalStrategy = require('passport-local')
let crypto = require('crypto')
let passportjwt = require('passport-jwt')
let cors = require('cors')
let secret = require('./lib/secret')

require('dotenv').config()

let auth = require('./lib/auth')

let errors = require('./public/js/error')

// Routers //
let landingRouter = require('./routes/landing')
let cloudRouter = require('./routes/cloud')
let orgRouter = require('./routes/organization')
let apiRouter = require('./routes/api')

let model = require('./lib/model')

let app = express()

app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

hbs.registerPartials(path.join(__dirname, 'views'))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Register Routers //
app.use('/', landingRouter)
app.use('/cloud', cloudRouter)
app.use('/organization', orgRouter)
app.use('/api', apiRouter)

// Auth //
passport.use(
    new passportjwt.Strategy(
        {
            jwtFromRequest: (req) => {
                // Gets JWT from Cookie 'auth' //
                let token = undefined
                if (req && req.cookies && req.cookies['auth'])
                    token = req.cookies['auth'].token
                return token
            },
            secretOrKey: secret.jwtKey,
            issuer: secret.jwtOptions.issuer,
            audience: secret.jwtKey.audience,
        },
        ({username, ...payload}, done) => {
            // Return User Data //
            model.FindUser(username).then((user) => {
                if(user == undefined) return done(null, false)

                done(null, {
                    ...user.toJSON()
                })
            })
            /*return done(null, {
                username: payload.username,
            })*/
        },
    ),
)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)

    res.render('error', errors.getError(err.status || 500))
})

module.exports = app
