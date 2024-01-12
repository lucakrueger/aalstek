const { Sequelize, DataTypes, Op } = require('sequelize')

let jsonwebtoken = require('jsonwebtoken')
let {uuid} = require('uuidv4')

let crypto = require('crypto')
let secret = require('./secret')

const sequelize = new Sequelize('aalstek', 'aalstek', 'password', {
    host: process.env.DB || 'localhost',
    dialect: 'mariadb',
})

sequelize.authenticate().then(() => {
    console.log('MariaDB connection has been established successfully')
})

const User = sequelize.define(
    'User',
    {
        userid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {},
)

const Organization = sequelize.define(
    'Organization',
    {
        orgid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {}
)

const Project = sequelize.define(
    'Project',
    {
        projectid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {}
)

User.belongsToMany(Project, { through: 'UserProjects', constraints: true })
Project.belongsToMany(User, { through: 'UserProjects', constraints: true })

Organization.hasMany(Project)
Project.belongsTo(Organization)

sequelize.sync()

/**
 * Checks if user exists
 * @param {string} user Username or Email
 */
const UserExists = (user) => {
    return User.findAll({
        where: {
            [Op.or]: [{ username: user }, { email: user }],
        },
    }).then((users) => {
        return users.length != 0
    })
}

const FindUser = (account) => {
    return User.findOne({
        where: {
            [Op.or]: [{ username: account }, { email: account }],
        },
    }).then((user) => {
        return user || undefined
    })
}

/**
 * Creates New User
 * @param {any} User
 */
const CreateUser = async ({ name, username, email, password }) => {
    if (await UserExists(username)) return false

    return User.create({
        name,
        username,
        email,
        password: crypto
            .createHash('sha256', secret.encryptionKey)
            .update(password)
            .digest('hex'),
    }).then((value) => {
        return true
    })
}

const ValidateUser = async (account, password) => {
    return FindUser(account).then((user) => {
        if (user == undefined) return false

        return (
            crypto
                .createHash('sha256', secret.encryptionKey)
                .update(password)
                .digest('hex') == user.get('password')
        )
    })
}

const issueJWT = (username) => {
    return jsonwebtoken.sign({username}, secret.jwtKey, {
        issuer: secret.jwtOptions.issuer,
        audience: secret.jwtOptions.audience
    })
}

const IssueCookieContent = (username) => {
    let jwt = issueJWT(username)
    return {
        username: username,
        token: jwt,
    }
}

const GetUserProjects = async (username) => {
    return FindUser(username).then((user) => {
        if(user == undefined) return undefined

        return user.getProjects().then(projects => {
            return projects
        })
    })
}

const GetProjectsByOrganization = async  (projects) => {
    if(projects == undefined) return []

    let sorted = {}

    for(let project of projects) {
        let org = await project.getOrganization()

        if(org == undefined) continue

        if(sorted[org.name] == undefined) {
            sorted[org.name] = {
                name: org.title,
                id: org.name,
                projects: []
            }
        }

        if(project.name == 'hidden') continue

        sorted[org.name].projects.push({
            name: project.title,
            id: project.name,
            description: project.description
        })
    }

    let ls = []
    for(let key of Object.keys(sorted)) ls.push(sorted[key])

    return ls
}

const CreateProject = async ({name, title, description, org}) => {
    return Project.create({
        name,
        title,
        description,
    }).then(project => {
        return FindOrg(org).then(orga => {
            project.setOrganization(orga)
            return project
        })
    })
}

const FindProject = async (name, org) => {
    return Organization.findOne({
        where: {
            name: org
        }
    }).then(organization => {
        return Project.findOne({
            where: {
                name: name
            },
            include: Organization
        }).then(project => {
            return project
        })
    })
}

const GetProjectUsers = async (name, org) => {
    return FindProject(name, org).then(project => {
        return project.getUsers()
    })
}

const CreateOrganization = async ({name, title, username}) => {
    return Organization.findAll({
        where: {
            name: name
        }
    }).then(orgs => {
        if(orgs.length > 0) return false

        return Organization.create({
            name,
            title
        }).then(value => {
            CreateProject({
                name: 'hidden',
                org: name,
                description: 'Hidden Project',
                title: 'Hidden'
            }).then(project => {
                FindUser(username).then(user => {
                    user.addProject(project)
                })
            })
    
            return true
        })
    })
}

const FindOrg = async (name) => {
    return Organization.findOne({
        where: {
            name: name
        }
    })
}

const CreateOrgProject = async ({name, title, description, org, username}) => {
    return FindProject(name, org).then(exists => {
        if(exists != null) return false

        return CreateProject({name, title, description, org}).then(project => {
            return FindOrg(org).then(organization => {
                if(organization == null) return false

                return organization.addProject(project).then(() => {
                    FindUser(username).then(user => {
                        user.addProject(project)
                    })
                    return true
                })
            })
        })
    })
}

const UserInOrg = async (username, org) => {

}

module.exports = {
    UserExists,
    CreateUser,
    ValidateUser,
    FindUser,
    IssueCookieContent,
    GetUserProjects,
    CreateProject,
    FindProject,
    CreateOrgProject,
    CreateOrganization,
    FindOrg,
    GetProjectUsers,
    GetProjectsByOrganization
}
