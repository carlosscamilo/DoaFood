var jwt = require('jsonwebtoken')

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).send({ error: 'Token não encontrado' })
    } else {
        jwt.verify(token, 'd629f341dd2f14b4addd5776505a2e0c30731a61c165b58a9b9fb33d1ce3f85c', (err, user) => {
            if (err){
                return res.status(403).send({ error: 'Token inválido' })
            }else{
                req.user = user
                next()
            }
        })
    }
}

module.exports = authenticateToken;