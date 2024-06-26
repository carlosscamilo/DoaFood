var express = require('express');
var router = express.Router();


const url = "https://doafood-backend.onrender.com/auth/login"

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('layout', { isLoginPage: true, body: 'pages/login', title: 'Express', error: '' });
});

router.post('/', (req, res) => {
    const { username, password } = req.body
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(async (res) => {
            if (!res.ok) {
                const err = await res.json()
                console.log('err', err)
                throw err
            }
            return res.json()
        })
        .then((data) => {
            req.session.token = data.token 
            req.session.username = username;
            res.redirect('/users')
        })
        .catch((error) => {
            console.log('Erro', error)
            res.render('layout', { isLoginPage: true, body: 'pages/login', title: 'Express', error,})
        })
})

module.exports = router;