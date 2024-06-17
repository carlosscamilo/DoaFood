var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database/database.db')


//CRIANDO TABELA DE BENEFICIÁIO
db.run(`
    CREATE TABLE IF NOT EXISTS beneficiario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    endereco TEXT NOT NULL,
    telefone TEXT NOT NULL
)`, (err) => {
  if (err) {
    console.error('Erro ao criar a tabela de beneficiário: ', err);
  } else {
    console.log('Tabela de beneficiário criada com sucesso!')
  }
});


//CRIANDO NOVO BENEFICIÁRIO
router.post('/', (req, res) => {
  const {nome, cnpj, endereco, telefone} = req.body;
  db.run(`INSERT INTO beneficiario (nome, cnpj, endereco, telefone) VALUES (?, ?, ?, ?)`, [nome, cnpj, endereco, telefone], (err) => {
    if(err) {
      console.log('Erro ao criar o beneficiario: ', err)
      return res.status(500).send({error: 'Erro ao criar o beneficiario'})
    } else {
      res.status(201).send({message: "Beneficiario criado com sucesso"})
    }
  });
  console.log(req.body);
});


//BUSCANDO TODOS OS BENEFICIÁRIOS
router.get('/', function(req, res, next) {
  db.all('SELECT * FROM beneficiario', (err, benefs) => {
    if (err) {
      console.log('Beneficiários não foram encontrados', err)
      return res.status(500).send({erro: "Beneficiários não encontrados"});
    } else {
      res.status(200).send(benefs);
    }
  });
});


//BUSCANDO BENEFICIÁRIO POR ID
router.get('/:id', function (req, res, next) {
  const { id } = req.params;
  db.get('SELECT * FROM beneficiario WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Beneficiário não encontrado', err);
      return res.status(500).json({ error: 'Beneficiário não encontrado' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Beneficiário não encontrado' });
    }
    res.status(200).json(row);
  });
});

//ATUALIZANDO BENEFICIÁRIO
router.put('/:id', function (req, res, next) {
  const { id } = req.params;
  const { nome, cnpj, endereco, telefone } = req.body;
  db.run(`UPDATE beneficiario SET nome = ?, cnpj = ?, endereco = ?, telefone = ? WHERE id = ?`, [nome, cnpj, endereco, telefone, id], function (err) {
    if(err) {
      console.log('Erro ao atualizar o beneficiario: ', err)
      return res.status(500).send({error: 'Erro ao atualizar o beneficiario'});
    }
    
    if(this.changes === 0) {
      return res.status(400).json({error: 'Beneficiário não encontrado'});
    }

    res.status(200).json({message: 'Beneficiário atualizado com sucesso!'});
  })
  console.log(req.body);
});


// ATUALIZA PARCIALMENTE O BENEFICIÁRIO
router.patch('/:id', function(req, res, next) {
  const { id } = req.params;
  const fields = req.body;
  const keys = Object.keys(fields);
  const values = Object.values(fields);

  if (keys.length === 0) {
    return res.status(400).json({error: 'Nenhum campo fornecido para a atualização'});
  }

  const setClause = keys.map((key) => `${key} = ?`).join(', ');

  db.run(`UPDATE beneficiario SET ${setClause} WHERE id = ?`, [...values, id], function(err) {
    if(err) {
      console.log('Erro ao atualizar o beneficiario parcialmente', err);
      return res.status(500).send({error: 'Erro ao atualizar o beneficiario parcialmente'});
    }

    if(this.changes === 0) {
      return res.status(400).json({error: 'Beneficiário não encontrado'});
    }

    res.status(200).json({message: 'Beneficiário atualizado parcialmente com sucesso!'});
  })
});

router.delete('/:id', function (req, res, next) {
  const { id } = req.params;
  db.run(`DELETE FROM beneficiario WHERE id = ?`, [id], function (err) {
    if(err) {
      console.log('Erro ao deletar o beneficiario', err);
      return res.status(500).send({error: 'Erro ao deletar o beneficiario'});
    }

    if(this.changes === 0) {
      return res.status(400).json({error: 'Beneficiário não encontrado'});
    }

    res.status(200).json({message: 'Beneficiário deletado com sucesso'});
  }); 
})

module.exports = router;
