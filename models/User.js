const Sequelize = require('sequelize')
const db = require('./db')

const User = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },

})


//Criar a tabela - depois de criar - comentar

/* User.sync({force: false}).then(() => {
    console.log("Tabela criada com sucesso")
}).catch((error) => {
    console.log("Erro: Tabela não criada " +error)
}) */

module.exports = User