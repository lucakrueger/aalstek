module.exports.lib = {
    400: {
        status: 400,
        title: 'Bad Request',
        message: 'The server couldnt handle the request.',
        help: 'Try again. If the problem persists, open a support ticket.',
        link: {
            text: 'Open a ticket?',
            url: '/ticket',
        },
    },
    401: {
        status: 401,
        title: 'Unauthorized',
        message: 'You dont have permission to access this page.',
        help: 'Login to get access.',
        link: {
            text: 'Do you need to login?',
            url: '/login',
        },
    },
    403: {
        status: 403,
        title: 'Forbidden',
        message: 'You dont have permission to access this page.',
        help: 'Contact the responsibles to get access.',
    },
    404: {
        status: 404,
        title: 'Not Found',
        message: 'We couldnt find what you are looking for.',
        help: 'It may have been deleted. Contact the responsibles to find out more.',
    },
    500: {
        status: 500,
        title: 'Internal Error',
        message: 'The server encountered a situation it cant handle.',
        help: 'Try again. If the problem persists, open a support ticket.',
        link: {
            text: 'Open a ticket?',
            url: '/ticket',
        },
    },
    502: {
        status: 502,
        title: 'Bad Gateway',
        message: 'The server got an invalid response.',
        help: 'Try again. If the problem persists, open a support ticket.',
        link: {
            text: 'Open a ticket?',
            url: '/ticket',
        },
    },
    503: {
        status: 503,
        title: 'Service Unavailable',
        message: 'The service is currently unavailable.',
        help: 'It may be a routine maintenance.',
        link: {
            text: 'Check current status?',
            url: '/status',
        },
    },
}

module.exports.getError = (status) => {
    let res = module.exports.lib[status]

    if (res == undefined || res == null) res = module.exports.lib[500]

    return res
}
