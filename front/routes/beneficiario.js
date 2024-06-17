var express = require('express');
var router = express.Router();
const url = 'https://silver-journey-vr75rvxqjwqhwwwj-4000.app.github.dev/beneficiario/';

/* GET home page. */
router.get('/', function(req, res, next) {

  fetch(url, { method: 'GET' })
  .then(async (res) =>{
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  })
  .then((benefs) => {
    let title = 'Gestão de Beneficiários';
    let cols = ["Id", "Nome", "Cnpj", "Endereço", "Telefone", "Ações"]
    res.render('beneficiario', {title, benefs, cols, error: "" });
  })  
  .catch((error) => {
    console.log('Erro', error);
    res.status(500).send("Erro ao Buscar Beneficiários");
  })
});

//Post Novo Beneficiário
router.post("/", (req, res) => {
  const { nome, cnpj, endereco, telefone } = req.body;
  fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
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
  fetch(url+id, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
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
  fetch(url+id, {
    method: "DELETE"
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
  const { id } = req.params
  fetch(url+id, {
    method: "GET"
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
