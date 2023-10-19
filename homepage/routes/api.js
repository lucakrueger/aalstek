let express = require('express')
let router = express.Router()
let passport = require('passport')

let crypto = require('crypto')
let form = require('../public/js/form')
let forms = require('../public/js/forms')
let model = require('../lib/model')

router.post('/login', (req, res, next) => {
    model.ValidateUser(req.body.account, req.body.password).then((valid) => {
        if (valid) {
            res.cookie('auth', model.IssueCookieContent(req.body.account))
        }

        res.json({
            logged: valid,
            account: {
                failed: valid == false,
                reason: '',
            },
            password: {
                failed: valid == false,
                reason: '',
            },
        })
    })
})

router.post('/account/exists', (req, res, next) => {
    model.UserExists(req.body.username).then((usernameExists) => {
        model.UserExists(req.body.email).then((emailExists) => {
            res.json({
                exists: usernameExists && emailExists,
            })
        })
    })
})

router.post('/project/new', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const verificationForm = form.loadVerificationForm(forms.projectNewForm).populate({
        name: req.body.name,
        description: req.body.description,
        organization: req.body.organization
    })

    if(verificationForm.validate() == true) {
        model.CreateOrgProject({
            title: req.body.name,
            description: req.body.description,
            name: form.idFromString(req.body.name),
            org: req.body.organization,
            username: req.user.username
        }).then(created => {
            console.log('OK')
            created == true ? res.send({
                created: true
            }) : res.send({
                created: false,
                reason: 'Project already exists'
            })
        })
    } else {
        res.send({
            created: false,
            fields: verificationForm.validateAsObject()
        })
    }
})

router.post('/organization/new', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    const verificationForm = form.loadVerificationForm(forms.orgNewForm).populate({
        name: req.body.name
    })

    if(verificationForm.validate() == true) {
        model.CreateOrganization({
            title: req.body.name,
            name: form.idFromString(req.body.name),
            username: req.user.username
        }).then(created => {
            created == true ? res.send({
                created: true
            }) : res.send({
                created: false,
                reason: 'Organization already exists'
            })
        })
    } else {
        res.send({
            created: false,
            fields: verificationForm.validateAsObject()
        })
    }
})

router.post('/register', (req, res, next) => {
    let verificationForm = form.loadVerificationForm(forms.registerForm)
    verificationForm.remove(['confirmPassword'])

    let user = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
    }

    verificationForm.populate(user)

    let valid = verificationForm.validate()

    if (valid == true) {
        model.CreateUser(user).then((created) => {
            res.send({
                created,
                fields: {
                    username: {
                        failed: created == false,
                        reason: 'Already exists',
                    },
                    email: {
                        failed: created == false,
                        reason: 'Already exists',
                    },
                },
            })

            return
        })
    } else {
        res.send({
            created: false,
            fields: verificationForm.validateAsObject(),
        })
    }
})

module.exports = router
