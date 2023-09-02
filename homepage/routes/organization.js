let express = require('express');
let router = express.Router();

router.get('/new', (req, res, next) => {
    res.render('organization/new', {});
})

router.get('/:orgid', (req, res, next) => {
    res.render('organization/index', {
        orgid: req.params.orgid,
        orgname: 'Aalstek',
        members: [
            {
                name: 'Luca Krüger',
                username: 'lucakrueger'
            }
        ]
    });
})

router.get('/:orgid/manage', (req, res, next) => {
    res.render('organization/index', {
        orgid: req.params.orgid,
        orgname: 'Aalstek',
        manage: true,
        members: [
            {
                name: 'Luca Krüger',
                username: 'lucakrueger'
            }
        ]
    });
})

router.get('/:orgid/invite', (req, res, next) => {
    res.render('organization/index', {
        orgid: req.params.orgid,
        orgname: 'Aalstek',
        invite: true,
        inviteLink: 'aalstek.de/invite/inviteid',
        members: [
            {
                name: 'Luca Krüger',
                username: 'lucakrueger'
            }
        ]
    });
})

router.get('/:orgid/member/:username', (req, res, next) => {
    res.render('organization/index', {
        orgid: req.params.orgid,
        orgname: 'Aalstek',
        member: true,
        memberData: {
            name: 'Luca Krüger',
            username: 'lucakrueger',
            role: 'Owner'
        },
        availableRoles: [
            'Owner',
            'Manager',
            'Default'
        ],
        members: [
            {
                name: 'Luca Krüger',
                username: 'lucakrueger'
            }
        ]
    });
})


module.exports = router;
