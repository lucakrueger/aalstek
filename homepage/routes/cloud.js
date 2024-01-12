let express = require('express')
let router = express.Router()
let passport = require('passport')
let model = require('../lib/model')

router.get('/', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    model.GetUserProjects(req.user.username).then(async projects => {
        const sorted = await model.GetProjectsByOrganization(projects)

        res.render('cloud/overview/index', {
            authenticated: true,
            username: req.user.username,
            orgs: sorted
        })
    })
})

router.get('/:orgid/new', passport.authenticate('jwt', { session: false }),(req, res, next) => {
    res.render('cloud/project/new', {
        authenticated: true,
        username: req.user.username,
        orgid: req.params.orgid
    })
})

router.get('/:orgid/:projectid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.render('cloud/project/index', {
        authenticated: true,
        username: req.user.username,
        title: 'Aalstek/Website',
        orgid: 'aalstek',
        projectid: 'Website',
        baseurl: `/cloud/${req.params.orgid}/${req.params.projectid}`,
        overview: true,
        topnav: [
            {
                title: 'Functions',
                url: '/functions',
            },
            {
                title: 'Storage',
                url: '/storage',
            },
            {
                title: 'Hosting',
                url: '/hosting',
            },
            {
                title: 'Manage',
                url: '/manage',
            },
        ],
    })
})

router.get('/:orgid/:projectid/functions', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.render('cloud/project/index', {
        authenticated: true,
        username: req.user.username,
        title: 'Aalstek/Website',
        orgid: 'aalstek',
        projectid: 'Website',
        baseurl: `/cloud/${req.params.orgid}/${req.params.projectid}`,
        functions: true,
        topnav: [
            {
                title: 'Functions',
                url: '/functions',
            },
            {
                title: 'Storage',
                url: '/storage',
            },
            {
                title: 'Hosting',
                url: '/hosting',
            },
            {
                title: 'Manage',
                url: '/manage',
            },
        ],
        functions: [
            {
                name: 'GetUser',
            },
            {
                name: 'NewUser',
            },
        ],
    })
})

router.get('/:orgid/:projectid/functions/:functionid', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.render('cloud/project/index', {
        authenticated: true,
        username: req.user.username,
        title: 'Aalstek/Website',
        orgid: 'aalstek',
        projectid: 'Website',
        baseurl: `/cloud/${req.params.orgid}/${req.params.projectid}`,
        functions: true,
        topnav: [
            {
                title: 'Functions',
                url: '/functions',
            },
            {
                title: 'Storage',
                url: '/storage',
            },
            {
                title: 'Hosting',
                url: '/hosting',
            },
            {
                title: 'Manage',
                url: '/manage',
            },
        ],
        functionData: {
            name: req.params.functionid,
            type: 'Public',
            category: 'Data Retrieval',
            status: 'Active',
            actions: {
                startable: false,
                restartable: true,
                stoppable: true,
                committable: true,
            },
        },
        functions: [
            {
                name: 'GetUser',
            },
            {
                name: 'NewUser',
            },
        ],
    })
})

module.exports = router
