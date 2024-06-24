const Sequelize = require('sequelize')

const sequelize = new Sequelize("celke", "root", "senha",{
    host: "localhost",
    dialect: "mysql",
    /*define: {
        timestamps: false
    }*/
})

sequelize.authenticate()
.then(() => {
    console.log("Conexão com o banco de dados realizada com sucesso")
}).catch((error) => {
    console.log("Erro: Conexão com o banco de dados não realizada com sucesso " +error)
})

module.exports = sequelize
