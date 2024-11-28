const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 3000;

// Serve os arquivos estáticos da pasta "public"
app.use(express.static('public'));

// Configura o body-parser para ler JSON
app.use(bodyParser.json());

// Conectando ao banco de dados SQLite
const db = new sqlite3.Database('clinica_veterinaria.db');

// Criar as tabelas se não existirem
db.serialize(() => {
    // Tabela Clientes
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT UNIQUE NOT NULL,
            telefone TEXT NOT NULL,
            email TEXT NOT NULL,
            endereco TEXT NOT NULL
        )
    `);

    // Tabela Animais
    db.run(`
        CREATE TABLE IF NOT EXISTS animais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            especie TEXT NOT NULL,
            raca TEXT NOT NULL,
            data_nascimento DATE NOT NULL,
            cliente_cpf TEXT NOT NULL,
            FOREIGN KEY (cliente_cpf) REFERENCES clientes(cpf)
        )
    `);

    // Tabela Funcionários
    db.run(`
        CREATE TABLE IF NOT EXISTS funcionarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT UNIQUE NOT NULL,
            telefone TEXT NOT NULL,
            email TEXT NOT NULL,
            data_nascimento DATE NOT NULL,
            data_admissao DATE NOT NULL,
            carteira_trabalho TEXT NOT NULL,
            setor TEXT NOT NULL
        )
    `);

    // Tabela Consultas
    db.run(`
        CREATE TABLE IF NOT EXISTS consultas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE NOT NULL,
            hora TIME NOT NULL,
            tipo_consulta TEXT NOT NULL,
            observacao TEXT,
            cliente_cpf TEXT,
            animal_id INTEGER,
            funcionario_cpf TEXT,
            FOREIGN KEY (cliente_cpf) REFERENCES clientes(cpf),
            FOREIGN KEY (animal_id) REFERENCES animais(id),
            FOREIGN KEY (funcionario_cpf) REFERENCES funcionarios(cpf)
        )
    `);

    // Tabela Prontuários
    db.run(`
        CREATE TABLE IF NOT EXISTS prontuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE NOT NULL,
            especie_animal TEXT NOT NULL,
            porte TEXT NOT NULL,
            raca_animal TEXT NOT NULL,
            peso_animal REAL,
            alergias TEXT,
            vacinas TEXT,
            historico_medico TEXT,
            diagnostico TEXT NOT NULL,
            tratamento TEXT NOT NULL,
            animal_id INTEGER,
            funcionario_cpf TEXT,
            FOREIGN KEY (animal_id) REFERENCES animais(id),
            FOREIGN KEY (funcionario_cpf) REFERENCES funcionarios(cpf)
        )
    `);
});

// ************************************
// ************************************
// *****      CLIENTES      *********
// ************************************

// Rota para cadastrar um cliente
app.post('/cadastrar-cliente', (req, res) => {
    const { nome, cpf, telefone, email, endereco } = req.body;
    db.run("INSERT INTO clientes (nome, cpf, telefone, email, endereco) VALUES (?, ?, ?, ?, ?)", 
    [nome, cpf, telefone, email, endereco], function (err) {
        if (err) {
            console.error('Erro ao cadastrar cliente:', err);
            res.status(500).send('Erro ao cadastrar cliente');
        } else {
            res.send('Cliente cadastrado com sucesso!');
        }
    });
});

// Rota para atualizar um cliente
 app.put('/atualizar-cliente', (req, res) => {
    const { id, nome, cpf, telefone, email, endereco } = req.body;
    db.run("UPDATE clientes SET nome = ?, cpf = ?, telefone = ?, email = ?, endereco = ? WHERE id = ?", 
    [nome, cpf, telefone, email, endereco, id], function (err) {
        if (err) {
            console.error('Erro ao atualizar cliente:', err);
            res.status(500).send('Erro ao atualizar cliente');
        } else {
            res.send('Cliente atualizado com sucesso!');
        }
    });
}); 



// ************************************
// ************************************
// *****       ANIMAIS      *********
// ************************************

// Rota para cadastrar um animal
app.post('/cadastrar-animal', (req, res) => {
    const { nome, especie, raca, data_nascimento, cliente_cpf } = req.body;
    db.run("INSERT INTO animais (nome, especie, raca, data_nascimento, cliente_cpf) VALUES (?, ?, ?, ?, ?)", 
    [nome, especie, raca, data_nascimento, cliente_cpf], function (err) {
        if (err) {
            console.error('Erro ao cadastrar animal:', err);
            res.status(500).send('Erro ao cadastrar animal');
        } else {
            res.send('Animal cadastrado com sucesso!');
        }
    });
});

// Rota para atualizar um animal
 app.put('/atualizar-animal', (req, res) => {
    const { id, nome, especie, raca, data_nascimento, cliente_cpf } = req.body;
    db.run("UPDATE animais SET nome = ?, especie = ?, raca = ?, data_nascimento = ?, cliente_cpf = ? WHERE id = ?", 
    [nome, especie, raca, data_nascimento, cliente_cpf, id], function (err) {
        if (err) {
            console.error('Erro ao atualizar animal:', err);
            res.status(500).send('Erro ao atualizar animal');
        } else {
            res.send('Animal atualizado com sucesso!');
        }
    });
}); 



// ************************************
// ************************************
// *****    CONSULTAS    **************
// ************************************

// Rota para cadastrar uma consulta
app.post('/cadastrar-consulta', (req, res) => {
    const { data, hora, tipo_consulta, observacao, cliente_cpf, animal_id, funcionario_cpf } = req.body;
    db.run("INSERT INTO consultas (data, hora, tipo_consulta, observacao, cliente_cpf, animal_id, funcionario_cpf) VALUES (?, ?, ?, ?, ?, ?, ?)", 
    [data, hora, tipo_consulta, observacao, cliente_cpf, animal_id, funcionario_cpf], function (err) {
        if (err) {
            console.error('Erro ao cadastrar consulta:', err);
            res.status(500).send('Erro ao cadastrar consulta');
        } else {
            res.send('Consulta cadastrada com sucesso!');
        }
    });
});


// Rota para buscar pet (autocomplete no front-end)
app.get('/buscar-pet', (req, res) => {
    const query = req.query.query;

    // Busca no banco de dados com base no CPF do cliente
    db.all("SELECT id, nome FROM animais WHERE cliente_cpf LIKE ? ", [`%${query}%`], (err, rows) => {
        if (err) {
            console.error('Erro ao buscar animal:', err);
            res.status(500).send('Erro ao buscar animal');
        } else {
            res.json(rows);  // Retorna os animal encontrados
        }
    });
});

// Rota para consultar agendamentos
app.get('/consultar-agendamentos', (req, res) => {
    const { data, tipo_consulta, observacao, cliente_cpf, animal_id, funcionario_cpf } = req.query;

    let sql = `
        SELECT 
            consultas.id,
            consultas.data, 
            consultas.hora, 
            consultas.tipo_consulta, 
            animais.nome AS nome_animal,
            clientes.nome AS nome_cliente, 
            funcionarios.nome AS nome_profissional 
        FROM 
            consultas
        JOIN 
            clientes ON consultas.cliente_cpf = clientes.cpf
        JOIN 
            funcionarios ON consultas.funcionario_cpf = funcionarios.cpf
        JOIN 
            animais ON consultas.animal_id = animais.id
        WHERE 1=1
    `;
    const params = [];

    if (data) {
        sql += " AND consultas.data = ?";
        params.push(data);
    }
    if (tipo_consulta) {
        sql += " AND consultas.tipo = ?";
        params.push(tipo_consulta);
    }
    if (observacao) {
        sql += " AND consultas.observacao = ?";
        params.push(observacao);
    }
    if (cliente_cpf) {
        sql += " AND consultas.cliente_cpf = ?";
        params.push(cliente_cpf);
    }
    if (animal_id) {
        sql += " AND consultas.animal_id = ?";
        params.push(animal_id);
    }
    if (funcionario_cpf) {
        sql += " AND consultas.funcionario_cpf = ?";
        params.push(funcionario_cpf);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Erro ao consultar agendamentos:', err);
            return res.status(500).send('Erro ao consultar agendamentos.');
        }
        res.json(rows);
    });
});

// Rota para excluir um agendamento
app.delete('/excluir-agendamento', (req, res) => {
    const { id } = req.query;
    db.run("DELETE FROM consultas WHERE id = ?", [id], function (err) {
        if (err) {
            console.error('Erro ao excluir agendamento:', err);
            return res.status(500).send('Erro ao excluir agendamento');
        }
        res.send('Agendamento excluído com sucesso');
    });
});

// ************************************
// ************************************
// *****    PRONTUÁRIOS    ************
// ************************************


// Rota para cadastrar um prontuário
app.post('/cadastrar-prontuario', (req, res) => {
    const { data, especie_animal, porte, raca_animal, peso_animal, alergias, vacinas, historico_medico, diagnostico, tratamento, animal_id, funcionario_cpf } = req.body;
    db.run("INSERT INTO prontuarios (data, especie_animal, porte, raca_animal, peso_animal, alergias, vacinas, historico_medico, diagnostico, tratamento, animal_id, funcionario_cpf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
    [data, especie_animal, porte, raca_animal, peso_animal, alergias, vacinas, historico_medico, diagnostico, tratamento, animal_id, funcionario_cpf], function (err) {
        if (err) {
            console.error('Erro ao cadastrar prontuário:', err);
            res.status(500).send('Erro ao cadastrar prontuário');
        } else {
            res.send('Prontuário cadastrado com sucesso!');
        }
    });
});

// Rota para consultar prontuarios
app.get('/consultar-prontuario', (req, res) => {
    const { data, especie_animal, raca_animal, animal_id, funcionario_cpf } = req.query;

    let sql = `
        SELECT 
            prontuarios.id,
            prontuarios.data, 
            prontuarios.especie_animal,
            prontuarios.porte,
            prontuarios.raca_animal,
            prontuarios.peso_animal,
            prontuarios.alergias,
            prontuarios.vacinas,
            prontuarios.historico_medico,
            prontuarios.diagnostico,
            prontuarios.tratamento,
            animais.nome AS nome_animal,
            funcionarios.nome AS nome_profissional 
        FROM 
            prontuarios
        JOIN 
            animais ON prontuarios.animal_id = animais.id
        JOIN 
            funcionarios ON prontuarios.funcionario_cpf = funcionarios.cpf
        WHERE 1=1
    `;
    const params = [];

    if (data) {
        sql += " AND prontuarios.data = ?";
        params.push(data);
    }
    if (especie_animal) {
        sql += " AND prontuarios.especie_animal = ?";
        params.push(especie_animal);
    }
    if (raca_animal) {
        sql += " AND prontuarios.raca_animal = ?";
        params.push(raca_animal);
    }
    if (animal_id) {
        sql += " AND prontuarios.animal_id = ?";
        params.push(animal_id);
    }
    if (funcionario_cpf) {
        sql += " AND prontuarios.funcionario_cpf = ?";
        params.push(funcionario_cpf);
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Erro ao consultar agendamentos:', err);
            return res.status(500).send('Erro ao consultar agendamentos.');
        }
        res.json(rows);
    });
});


// Rota para buscar um prontuarios pelo ID
app.get('/prontuario', (req, res) => {
    const { id } = req.query;
    db.get("SELECT * FROM prontuarios WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error('Erro ao buscar prontuarios:', err);
            return res.status(500).send('Erro ao buscar prontuarios');
        }
        if (!row) return res.status(404).send('prontuario não encontrado');
        res.json(row);
    });
});
  



// ************************************
// ************************************
// *****      FUNCIONÁRIOS    *********
// ************************************

// Rota para cadastrar um funcionário
app.post('/cadastrar-funcionario', (req, res) => {
    const { nome, cpf, telefone, email, data_nascimento, data_admissao, carteira_trabalho, setor } = req.body;
    db.run("INSERT INTO funcionarios (nome, cpf, telefone, email, data_nascimento, data_admissao, carteira_trabalho, setor) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
    [nome, cpf, telefone, email, data_nascimento, data_admissao, carteira_trabalho, setor], function (err) {
        if (err) {
            console.error('Erro ao cadastrar funcionário:', err);
            res.status(500).send('Erro ao cadastrar funcionário');
        } else {
            res.send('Funcionário cadastrado com sucesso!');
        }
    });
});

// Rota para atualizar um funcionário
 app.put('/atualizar-funcionario', (req, res) => {
    const { id, nome, cpf, telefone, email, data_nascimento, data_admissao, carteira_trabalho, setor } = req.body;
    db.run("UPDATE funcionarios SET nome = ?, cpf = ?, telefone = ?, email = ?, data_nascimento = ?, data_admissao = ?, carteira_trabalho = ?, setor = ? WHERE id = ?", 
    [nome, cpf, telefone, email, data_nascimento, data_admissao, carteira_trabalho, setor, id], function (err) {
        if (err) {
            console.error('Erro ao atualizar funcionário:', err);
            res.status(500).send('Erro ao atualizar funcionário');
        } else {
            res.send('Funcionário atualizado com sucesso!');
        }
    });
}); 


// Teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor está rodando e tabelas criadas!');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

