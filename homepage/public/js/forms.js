const registerForm = {
    name: {
        text: 'Full Name',
        rules: [
            {
                rule: '(?=.{1,})',
                reason: 'Field cannot be empty',
            },
        ],
    },
    email: {
        text: 'Email',
        rules: [
            {
                rule: '(?=.{1,})',
                reason: 'Field cannot be empty',
            },
        ],
    },
    username: {
        text: 'Username',
        rules: [
            {
                rule: '(?=.{4,})',
                reason: 'Needs at least 4 Characters',
            },
            {
                rule: '(^[A-Za-z0-9]*$)',
                reason: 'Only use Letters and Numbers',
            },
        ],
    },
    password: {
        text: 'Password',
        rules: [
            {
                rule: '(?=.{8,})',
                reason: 'Needs at least 8 Characters',
            },
            {
                rule: '(?=.*[A-Z])',
                reason: 'Needs at least 1 Uppercase Letter',
            },
            {
                rule: '(?=.*[a-z])',
                reason: 'Needs at least 1 Lowercase Letter',
            },
            {
                rule: '(?=.*[0-9])',
                reason: 'Needs at least 1 Digit',
            },
            {
                rule: '([^A-Za-z0-9])',
                reason: 'Needs at leat 1 Special Character',
            },
        ],
    },
    confirmPassword: {
        text: 'Confirm Password',
        rules: [
            {
                rule: '(?=.{1,})',
                reason: 'Field cannot be empty',
            },
            {
                rule: (value) => {
                    return Form.password.input.value == value
                },
                reason: 'Passwords need to match',
            },
        ],
    },
}

const projectNewForm = {
    name: {
        text: 'Project Name',
        rules: [
            {
                rule: '(?=.{1,})',
                reason: 'Field cannot be empty'
            },
            {
                rule: '(^[A-Za-z0-9 ]*$)',
                reason: 'Only use Letters and Numbers'
            }
        ]
    },
    description: {
        text: 'Description',
        rules: [
            {
                rule: '(?=.{1,})',
                reason: 'Field cannot be empty'
            },
            {
                rule: (value) => {
                    return value.length <= 50
                },
                reason: 'Cannot have more than 50 Characters'
            }
        ]
    },
    organization: {
        text: 'Organization',
        rules: [
            {
                rule: '(?=.{1,})',
                reason: 'Field cannot be empty',
            },
        ],
    },
}

const orgNewForm = {
    name: {
        text: 'Organization Name',
        rules: [
            {
                rule: '(?=.{1,})',
                reason: 'Field cannot be empty'
            },
            {
                rule: '(^[A-Za-z0-9 ]*$)',
                reason: 'Only use Letters and Numbers'
            }
        ]
    }
}

module.exports = {
    registerForm,
    projectNewForm,
    orgNewForm
}
