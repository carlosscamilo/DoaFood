var express = require('express');
var router = express.Router();
const url = 'http://localhost:4000/doacoes';


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
  .then((doacoes) => {
    let title = 'Gestão de Doações';
    let cols = ["Id", "Descrição", "Data", "Doação", "Ações"];
    res.render('layout', { body: 'pages/doacao', title, doacoes, cols, error: "" });
  })
  .catch((error) => {
    console.log('Erro', error);
    res.render('layout', { body: 'pages/doacao', title: "Gestão de Doações", error: "Erro ao buscar doações" });
  });
});

// Post Nova Doação
router.post("/", (req, res) => {
  const { descricao, data, doacao } = req.body;
  fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
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
  fetch(url + '/' + id, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
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
  fetch(url + '/' + id, {
    method: "DELETE"
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
  fetch(url + '/' + id, {
    method: "GET"
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