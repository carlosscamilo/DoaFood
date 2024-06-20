var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var verifyJWT = require('../auth/verify-token');

const db = new sqlite3.Database('./database/database.db');

// CRIAÇÃO DA TABELA DE DOAÇÕES
db.run(`
    CREATE TABLE IF NOT EXISTS doacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    data TEXT NOT NULL,
    doacao TEXT NOT NULL
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela de doações: ', err);
  } else {
    console.log('Tabela de doações criada com sucesso!');
  }
});

// ROTA: Criar uma nova doação
router.post('/', verifyJWT, function (req, res) {
  const { descricao, data, doacao } = req.body;
  db.run('INSERT INTO doacoes (descricao, data, doacao) VALUES (?, ?, ?)', [descricao, data, doacao], (err) => {
    if (err) {
      console.error('Erro ao criar a doação: ', err);
      return res.status(500).send({ error: 'Erro ao criar a doação' });
    } else {
      res.status(201).send({ message: 'Doação criada com sucesso' });
    }
  });
});

// ROTA: Buscar todas as doações
router.get('/', verifyJWT, function(req, res, next) {
  db.all('SELECT * FROM doacoes', (err, doacoes) => {
    if (err) {
      console.error('Erro ao buscar doações: ', err);
      return res.status(500).send({ error: 'Erro ao buscar doações' });
    }
    res.status(200).send(doacoes);
  });
});

// ROTA: Buscar uma doação por ID
router.get('/:id', verifyJWT, function (req, res, next) {
  const { id } = req.params;
  db.get('SELECT * FROM doacoes WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Erro ao buscar a doação: ', err);
      return res.status(500).json({ error: 'Erro ao buscar a doação' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Doação não encontrada' });
    }
    res.status(200).json(row);
  });
});

// ROTA: Atualizar uma doação por ID
router.put('/:id', verifyJWT, function (req, res, next) {
  const { id } = req.params;
  const { descricao, data, doacao } = req.body;
  db.run(`UPDATE doacoes SET descricao = ?, data = ?, doacao = ? WHERE id = ?`, [descricao, data, doacao, id], function (err) {
    if(err) {
      console.error('Erro ao atualizar a doação: ', err);
      return res.status(500).send({ error: 'Erro ao atualizar a doação' });
    }
    
    if(this.changes === 0) {
      return res.status(404).json({ error: 'Doação não encontrada' });
    }

    res.status(200).json({ message: 'Doação atualizada com sucesso' });
  });
});

// ROTA: Atualizar parcialmente uma doação por ID
router.patch('/:id', verifyJWT, function(req, res, next) {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: 'Nenhum campo fornecido para a atualização' });
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE doacoes SET ${setClause} WHERE id = ?`, [...values, id], function(err) {
    if (err) {
      console.error('Erro ao atualizar a doação parcialmente', err);
      return res.status(500).send({ error: 'Erro ao atualizar a doação parcialmente' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Doação não encontrada' });
    }

    res.status(200).json({ message: 'Doação atualizada parcialmente com sucesso' });
  });
});

// ROTA: Deletar uma doação por ID
router.delete('/:id', verifyJWT, function (req, res, next) {
  const { id } = req.params;
  db.run(`DELETE FROM doacoes WHERE id = ?`, [id], function (err) {
    if (err) {
      console.error('Erro ao deletar a doação: ', err);
      return res.status(500).send({ error: 'Erro ao deletar a doação' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Doação não encontrada' });
    }

    res.status(200).json({ message: 'Doação deletada com sucesso' });
  });
});

module.exports = router;
