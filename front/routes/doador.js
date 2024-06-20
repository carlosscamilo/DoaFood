var express = require('express');
var router = express.Router();
const url = 'https://cuddly-space-fortnight-q7v44964x6jpc9v77-4000.app.github.dev/doador';

/* GET home page. */
router.get('/', function(req, res, next) {
  fetch(url, { method: 'GET' })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((doadores) => {
      let title = 'Gestão de Doadores';
      let cols = ["Id", "Nome", "Email", "Endereço", "Telefone", "Ações"];
      res.render('layout', { body: 'pages/doador',title, doadores, cols, error: "" });
    })
    .catch((error) => {
      console.log('Erro', error);
      res.render( 'layout' , { body: 'pages/doador',title :"gestâo de Doadores"});
    });
});

// Criar novo doador
router.post("/", (req, res) => {
  const { nome, email, endereco, telefone } = req.body;
  fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ nome, email, endereco, telefone })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  })
  .then((doador) => {
    res.send(doador);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
});

// Atualizar doador por ID
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email, endereco, telefone } = req.body;
  fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ nome, email, endereco, telefone })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  })
  .then((doador) => {
    res.send(doador);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
});

// Deletar doador por ID
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  fetch(`${url}/${id}`, {
    method: "DELETE"
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  })
  .then((doador) => {
    res.send(doador);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
});

// Buscar doador por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  fetch(`${url}/${id}`, {
    method: "GET"
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  })
  .then((doador) => {
    res.send(doador);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
});

module.exports = router;
