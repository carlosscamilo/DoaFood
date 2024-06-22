var express = require('express');
var router = express.Router();
const url = 'https://doafood-backend.onrender.com/doacoes';


/* GET home page. */
router.get('/', function(req, res, next) {
  let title = 'Gestão de Doações';
  let cols = ["Id", "Descrição", "Data", "Doação", "Ações"];

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
  .then((doacoes) => {
    res.render('layout', { username: req.session.username, isLoginPage: false, body: 'pages/doacao', title, doacoes, cols, error: "" });
  })
  .catch((error) => {
    console.log('Erro', error);
    res.redirect('/login');
  });
});

// Post Nova Doação
router.post("/", (req, res) => {
  const { descricao, data, doacao } = req.body;
  const token = req.session.token || "";

  fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ descricao, data, doacao })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  })
  .then((doacao) => {
    res.send(doacao);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
});

// Atualizando completamente a Doação
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { descricao, data, doacao } = req.body;
  const token = req.session.token || "";

  fetch(url + '/' + id, {
    method: "PUT",
    headers: {"Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ descricao, data, doacao })
  }).then(async (res) => {
    if (!res.ok) {
      const err = await res.json();
      throw err;
    }
    return res.json();
  })
  .then((doacao) => {
    res.send(doacao);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
});

// Deletar Doação
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const token = req.session.token || "";

  fetch(url + '/' + id, {
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
  .then((doacao) => {
    res.send(doacao);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
});

// Buscando Doação por ID
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
      const err = await res.json();
      throw err;
    }
    return res.json();
  })
  .then((doacao) => {
    res.send(doacao);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
});

module.exports = router;