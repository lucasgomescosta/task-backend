const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')


module.exports = app => {
    const signin = async (req, res) => {
        if(!req.body.email || !req.body.password) { //se email tá vazio ou faltou inserir a senha
            return res.status(400).send('Dados imcompletos')
        }

        const  user = await app.db('users')     //de forma async ele esperar pegar
            .where({ email: req.body.email })   //essa informação do BD
            .first()                             //pra continuar o método

        if (user) {
            //comparação da senha digitada pelo usuário com a senha salva no BD.
            bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
                if(err || !isMatch) {
                    return res.status(400).send()
                }

                const payload = { id: user.id }
                res.json({
                    name: user.name,
                    email: user.email,
                    token: jwt.encode(payload, authSecret)
                })
            })
        } else {
            res.status(400).send('Email não encontrado!')
        }
    }

    return { signin }
}