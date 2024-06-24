const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const routes = require ('./routes');

const { eAdmin } = require('./middleware/auth')
//const db = require('./models/db') //testar a conexao do banco via console.log()
const User = require('./models/User') //testar a conexao do banco via console.log()


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
    return res.send('pong')
})


app.get('/', eAdmin, async (req, res) => {
    await User.findAll({
        attributes: ['id', 'name', 'email'],
        order: [['id', "DESC"]]
    })
    .then((users) => {
        return res.json({
            erro: false,
            users: users,
            id_usuario_logado: req.userId
        })
    }).catch(() => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Nenhum usuário encontrado!",
        })
    })
})


app.post('/cadastrar', async (req, res) => {
    //console.log(req.body)
    var dados = req.body;
    
    dados.password = await bcrypt.hash(dados.password, 8)
    //const password = await bcrypt.hash(req.body.password, 8)

    //console.log(password)
    //console.log(dados)

    await User.create(dados)
    .then(() => {
        return res.json({
            erro: false,
            mensagem: "Usuário cadastrado com sucesso!",
        })
    }).catch((error) => {
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário não cadastrado!",
        })
    })

    return res.json({
        erro: false,
        mensagem: "Cadastrar usuário",
    })
})

app.post('/login', async (req, res) => {
    // $2a$08$Rl4lKw2Dtj64tSC7dFTlFOVTYArN8gavfqLVRiDaqTOMh2qvjfKxS
    //console.log(req.body)

    const user = await User.findOne({
        attributes: ['id', 'name', 'email', 'password'],
        where: {
            email: req.body.email
        }
    })

    if(user === null){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorretos!"
        })
    }


    if(!(await bcrypt.compare(req.body.password, user.password))){
        return res.status(400).json({
            erro: true,
            mensagem: "Erro: Usuário ou a senha incorretos!"
        })
    }

    var token = jwt.sign({id: user.id}, "J9N309539K622964LNGT01189JFR7649K9", {
        //expiresIn: 600 //10 minutos
        //expiresIn: 60 //1 minutos
        expiresIn: '7d' //7 dias
    })

    return res.json({
        erro: false,
        mensagem: "Login realizado com sucesso",
        token: token
    })
})


var port = (process.env.PORT || 3000)

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
})