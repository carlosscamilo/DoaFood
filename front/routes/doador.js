var express = require('express');
var router = express.Router();
const url = 'https://doafood-backend.onrender.com/doador/';

/* GET home page. */
router.get('/', function(req, res, next) {
  let title = 'Gestão de Doadores';
  let cols = ["Id", "Nome", "Email", "Endereço", "Telefone", "Ações"];

  const token = req.session.token || "";

    fetch(url, { method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json();
        throw err;
      }
      return res.json();
    })
    .then((doadores) => {
      res.render('layout', { username: req.session.username, isLoginPage: false, body: 'pages/doador', title, doadores, cols, error: "" });
    })
    .catch((error) => {
      console.log('Erro', error);
      res.redirect('/login');
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
    headers: {"Content-Type": "application/json",
    'Authorization': `Bearer ${token}`
    },
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
    method: "DELETE",
    headers: {
      'Authorization': `Bearer ${token}`
    }
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
  const token = req.session.token || "";
  fetch(`${url}/${id}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
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
