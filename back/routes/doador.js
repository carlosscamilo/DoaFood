var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');
var verifyJWT = require('../auth/verify-token');

const db = new sqlite3.Database('./database/database.db');

db.run(`
    CREATE TABLE IF NOT EXISTS doador (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    endereco TEXT NOT NULL,
    telefone TEXT NOT NULL
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela de doador: ', err);
  } else {
    console.log('Tabela de doador criada com sucesso!');
  }
});


router.post('/', verifyJWT, function (req, res) {
  const { nome, email, endereco, telefone } = req.body;
  db.run('INSERT INTO doador (nome, email, endereco, telefone) VALUES (?, ?, ?, ?)', [nome, email, endereco, telefone], (err) => {
    if (err) {
      console.error('Erro ao criar o doador: ', err);
      return res.status(500).send({ error: 'Erro ao criar o doador' });
    } else {
      res.status(201).send({ message: 'Doador criado com sucesso' });
    }
  });
});



router.get('/', verifyJWT, function(req, res, next) {
  db.all('SELECT * FROM doador', (err, doadores) => {
    if (err) {
      console.error('Erro ao buscar doadores: ', err);
      return res.status(500).send({ error: 'Erro ao buscar doadores' });
    }
    res.status(200).send(doadores);
  });
});


router.get('/:id', verifyJWT, function (req, res, next) {
    const { id } = req.params;
    db.get('SELECT * FROM doador WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('doador não encontrado', err);
        return res.status(500).json({ error: 'doador não encontrado' });
      }
      if (!row) {
        return res.status(404).json({ error: 'doador não encontrado' });
      }
      res.status(200).json(row);
    });
  });


router.put('/:id', verifyJWT, function (req, res, next) {
    const { id } = req.params;
    const { nome, email, endereco, telefone } = req.body;
    db.run(`UPDATE doador SET nome = ?, email = ?, endereco = ?, telefone = ? WHERE id = ?`, [nome, email, endereco, telefone, id], function (err) {
      if(err) {
        console.log('Erro ao atualizar o doador: ', err)
        return res.status(500).send({error: 'Erro ao atualizar o doador'});
      }
      
      if(this.changes === 0) {
        return res.status(400).json({error: 'doador não encontrado'});
      }
  
      res.status(200).json({message: 'doador atualizado com sucesso!'});
    })
    console.log(req.body);
  });


router.patch('/:id', verifyJWT, function(req, res, next) {
    const { id } = req.params;
    const fields = req.body;
    const keys = Object.keys(fields);
    const values = Object.values(fields);
  
    if (keys.length === 0) {
      return res.status(400).json({error: 'Nenhum campo fornecido para a atualização'});
    }
  
    const setClause = keys.map((key) => `${key} = ?`).join(', ');
  
    db.run(`UPDATE doador SET ${setClause} WHERE id = ?`, [...values, id], function(err) {
      if(err) {
        console.log('Erro ao atualizar o doador parcialmente', err);
        return res.status(500).send({error: 'Erro ao atualizar o doador parcialmente'});
      }
  
      if(this.changes === 0) {
        return res.status(400).json({error: 'doador não encontrado'});
      }
  
      res.status(200).json({message: 'doador atualizado parcialmente com sucesso!'});
    })
  });

  router.delete('/:id', verifyJWT, function (req, res, next) {
    const { id } = req.params;
    db.run(`DELETE FROM doador WHERE id = ?`, [id], function (err) {
      if(err) {
        console.log('Erro ao deletar o doador', err);
        return res.status(500).send({error: 'Erro ao deletar o doador'});
      }
  
      if(this.changes === 0) {
        return res.status(400).json({error: 'doador não encontrado'});
      }
  
      res.status(200).json({message: 'doador deletado com sucesso'});
    }); 
  })

module.exports = router;
