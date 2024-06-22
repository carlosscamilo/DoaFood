var express = require('express');
var router = express.Router();
const url = 'https://doafood-backend.onrender.com/beneficiario/';

/* GET home page. */
router.get('/', function(req, res, next) {
  let title = 'Gestão de Beneficiários';
  let cols = ["Id", "Nome", "Cnpj", "Endereço", "Telefone", "Ações"];

  const token = req.session.token || "";

  fetch(url, { method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
   })
  .then(async (res) =>{
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  })
  .then((benefs) => {
    res.render('layout', { username: req.session.username, isLoginPage: false, body: 'pages/beneficiario',title, benefs, cols, error: "" });
  })
  .catch((error) => {
    console.log('Erro', error);
    res.redirect('/login');
  });
});

//Post Novo Beneficiário
router.post("/", (req, res) => {
  const { nome, cnpj, endereco, telefone } = req.body;
  const token = req.session.token || "";

  fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ nome, cnpj, endereco, telefone })
  }).then(async (res) =>{
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  })
  .then((benef) => {
    res.send(benef);
  })  
  .catch((error) => {
    res.status(500).send(error);
  })
});

//ATUALIZANDO COMPLETAMENTE O BENEFICIÁRIO
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, cnpj, endereco, telefone } = req.body;
  const token = req.session.token || "";

  fetch(url+id, {
    method: "PUT",
    headers: {"Content-Type": "application/json",
              'Authorization': `Bearer ${token}`
      },
    body: JSON.stringify({ nome, cnpj, endereco, telefone })
  }).then(async (res) =>{
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  })
  .then((benef) => {
    res.send(benef);
  })  
  .catch((error) => {
    res.status(500).send(error);
  })
});

//DELETAR BENEFICIÁRIO
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, cnpj, endereco, telefone } = req.body;
  const token = req.session.token || "";

  fetch(url+id, {
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(async (res) =>{
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  })
  .then((benef) => {
    res.send(benef);
  })  
  .catch((error) => {
    res.status(500).send(error);
  })
});

//BUSCANDO BENEFICIÁRIO POR ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const token = req.session.token || "";
  fetch(url+id, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json()
      throw err
    }
    return res.json()
  })
    .then((benef) => {
      res.send(benef)
    })
    .catch((error) => {
      res.status(500).send(error)
    })
})

module.exports = router;
