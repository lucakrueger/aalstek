let express = require('express');
let router = express.Router();

router.get('/', (req, res, next) => {
  res.render('cloud/overview/index', {
    orgs: [
        {
            name: 'Luca Krüger',
            id: 'lucakrueger',
            projects: [
                {
                    name: 'Homepage',
                    id: 'homepage',
                    description: 'Personal Homepage'
                }
            ]
        },
        {
            name: 'Aalstek',
            id: 'aalstek',
            projects: [
                {
                    name: 'Homepage',
                    id: 'homepage',
                    description: 'Main Homepage'
                },
                {
                    name: 'Cloud API',
                    id: 'cloud-api',
                    description: 'Cloud API'
                }
            ]
        }
    ]
  });
})

router.get('/:orgid/new', (req, res, next) => {
    res.render('cloud/project/new', {})
})

router.get('/:orgid/:projectid', (req, res, next) => {
    res.render('cloud/project/index', {
        title: 'Aalstek/Website',
        orgid: 'aalstek',
        projectid: 'Website',
        baseurl: `/cloud/${req.params.orgid}/${req.params.projectid}`,
        overview: true,
        topnav: [
            {
                title: 'Functions',
                url: '/functions'
            },
            {
                title: 'Storage',
                url: '/storage'
            },
            {
                title: 'Hosting',
                url: '/hosting'
            },
            {
                title: 'Manage',
                url: '/manage'
            }
        ]
    });
})

router.get('/:orgid/:projectid/functions', (req, res, next) => {
    res.render('cloud/project/index', {
        title: 'Aalstek/Website',
        orgid: 'aalstek',
        projectid: 'Website',
        baseurl: `/cloud/${req.params.orgid}/${req.params.projectid}`,
        functions: true,
        topnav: [
            {
                title: 'Functions',
                url: '/functions'
            },
            {
                title: 'Storage',
                url: '/storage'
            },
            {
                title: 'Hosting',
                url: '/hosting'
            },
            {
                title: 'Manage',
                url: '/manage'
            }
        ],
        functions: [
            {
                name: 'GetUser'
            },
            {
                name: 'NewUser'
            }
        ]
    });
})

router.get('/:orgid/:projectid/functions/:functionid', (req, res, next) => {
    res.render('cloud/project/index', {
        title: 'Aalstek/Website',
        orgid: 'aalstek',
        projectid: 'Website',
        baseurl: `/cloud/${req.params.orgid}/${req.params.projectid}`,
        functions: true,
        topnav: [
            {
                title: 'Functions',
                url: '/functions'
            },
            {
                title: 'Storage',
                url: '/storage'
            },
            {
                title: 'Hosting',
                url: '/hosting'
            },
            {
                title: 'Manage',
                url: '/manage'
            }
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
            }
        },
        functions: [
            {
                name: 'GetUser'
            },
            {
                name: 'NewUser'
            }
        ]
    });
})

module.exports = router;
