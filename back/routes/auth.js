var express = require('express');
var router = express.Router();
var sqlite3 = require("sqlite3")
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const db = new sqlite3.Database('./database/database.db')

router.post('/login', (req, res) => {
    const { username, password } = req.body
    db.get('SELECT * FROM users WHERE username = ?', username, (err, row) => {
        if (!row) {
            console.log("Usuário não encontrado", err)
            return res.status(404).send({ error: 'Usuário não encontrado' })
        } else {
            bcrypt.compare(password, row.password, (err, result) => {
                if (err) {
                    console.log("Erro ao comparar as senhas", err)
                    return res.status(500).send({ error: 'Erro ao comparar as senhas' })
                } else if (!result) {
                    return res.status(401).send({ error: 'Senha incorreta' })
                } else {
                    const token = jwt.sign({ id: row.id }, 'd629f341dd2f14b4addd5776505a2e0c30731a61c165b58a9b9fb33d1ce3f85c', { expiresIn: '15m' })
                    return res.status(200).send({ message: 'Login com sucesso', token })
                }
            })
        }
    })
})

module.exports = router;