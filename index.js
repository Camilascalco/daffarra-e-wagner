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
            cliente_id INTEGER,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
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
            cliente_id INTEGER,
            animal_id INTEGER,
            funcionario_id INTEGER,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id),
            FOREIGN KEY (animal_id) REFERENCES animais(id),
            FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
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
            funcionario_id INTEGER,
            FOREIGN KEY (animal_id) REFERENCES animais(id),
            FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
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

// Rota para excluir um cliente
app.delete('/excluir-cliente', (req, res) => {
    const { id } = req.query;
    db.run("DELETE FROM clientes WHERE id = ?", [id], function (err) {
        if (err) {
            console.error('Erro ao excluir cliente:', err);
            res.status(500).send('Erro ao excluir cliente');
        } else {
            res.send('Cliente excluído com sucesso!');
        }
    });
});

// ************************************
// ************************************
// *****       ANIMAIS      *********
// ************************************

// Rota para cadastrar um animal
app.post('/cadastrar-animal', (req, res) => {
    const { nome, especie, raca, data_nascimento, cliente_id } = req.body;
    db.run("INSERT INTO animais (nome, especie, raca, data_nascimento, cliente_id) VALUES (?, ?, ?, ?, ?)", 
    [nome, especie, raca, data_nascimento, cliente_id], function (err) {
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
    const { id, nome, especie, raca, data_nascimento, cliente_id } = req.body;
    db.run("UPDATE animais SET nome = ?, especie = ?, raca = ?, data_nascimento = ?, cliente_id = ? WHERE id = ?", 
    [nome, especie, raca, data_nascimento, cliente_id, id], function (err) {
        if (err) {
            console.error('Erro ao atualizar animal:', err);
            res.status(500).send('Erro ao atualizar animal');
        } else {
            res.send('Animal atualizado com sucesso!');
        }
    });
});

// Rota para excluir um animal
app.delete('/excluir-animal', (req, res) => {
    const { id } = req.query;
    db.run("DELETE FROM animais WHERE id = ?", [id], function (err) {
        if (err) {
            console.error('Erro ao excluir animal:', err);
            res.status(500).send('Erro ao excluir animal');
        } else {
            res.send('Animal excluído com sucesso!');
        }
    });
});

// ************************************
// ************************************
// *****    CONSULTAS E PRONTUÁRIOS  *
// ************************************

// Rota para cadastrar uma consulta
app.post('/cadastrar-consulta', (req, res) => {
    const { data, hora, tipo_consulta, observacao, cliente_id, animal_id, funcionario_id } = req.body;
    db.run("INSERT INTO consultas (data, hora, tipo_consulta, observacao, cliente_id, animal_id, funcionario_id) VALUES (?, ?, ?, ?, ?, ?, ?)", 
    [data, hora, tipo_consulta, observacao, cliente_id, animal_id, funcionario_id], function (err) {
        if (err) {
            console.error('Erro ao cadastrar consulta:', err);
            res.status(500).send('Erro ao cadastrar consulta');
        } else {
            res.send('Consulta cadastrada com sucesso!');
        }
    });
});

// Rota para atualizar uma consulta
app.put('/atualizar-consulta', (req, res) => {
    const { id, data, hora, tipo_consulta, observacao, cliente_id, animal_id, funcionario_id } = req.body;
    db.run("UPDATE consultas SET data = ?, hora = ?, tipo_consulta = ?, observacao = ?, cliente_id = ?, animal_id = ?, funcionario_id = ? WHERE id = ?", 
    [data, hora, tipo_consulta, observacao, cliente_id, animal_id, funcionario_id, id], function (err) {
        if (err) {
            console.error('Erro ao atualizar consulta:', err);
            res.status(500).send('Erro ao atualizar consulta');
        } else {
            res.send('Consulta atualizada com sucesso!');
        }
    });
});

// Rota para excluir uma consulta
app.delete('/excluir-consulta', (req, res) => {
    const { id } = req.query;
    db.run("DELETE FROM consultas WHERE id = ?", [id], function (err) {
        if (err) {
            console.error('Erro ao excluir consulta:', err);
            res.status(500).send('Erro ao excluir consulta');
        } else {
            res.send('Consulta excluída com sucesso!');
        }
    });
});

// Rota para cadastrar um prontuário
app.post('/cadastrar-prontuario', (req, res) => {
    const { data, especie_animal, porte, raca_animal, peso_animal, alergias, vacinas, historico_medico, diagnostico, tratamento, animal_id, funcionario_id } = req.body;
    db.run("INSERT INTO prontuarios (data, especie_animal, porte, raca_animal, peso_animal, alergias, vacinas, historico_medico, diagnostico, tratamento, animal_id, funcionario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
    [data, especie_animal, porte, raca_animal, peso_animal, alergias, vacinas, historico_medico, diagnostico, tratamento, animal_id, funcionario_id], function (err) {
        if (err) {
            console.error('Erro ao cadastrar prontuário:', err);
            res.status(500).send('Erro ao cadastrar prontuário');
        } else {
            res.send('Prontuário cadastrado com sucesso!');
        }
    });
});

// Rota para excluir um prontuário
app.delete('/excluir-prontuario', (req, res) => {
    const { id } = req.query;
    db.run("DELETE FROM prontuarios WHERE id = ?", [id], function (err) {
        if (err) {
            console.error('Erro ao excluir prontuário:', err);
            res.status(500).send('Erro ao excluir prontuário');
        } else {
            res.send('Prontuário excluído com sucesso!');
        }
    });
});

// ************************************
// ************************************
// *****     FUNCIONÁRIOS    *********
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

// Rota para excluir um funcionário
app.delete('/excluir-funcionario', (req, res) => {
    const { id } = req.query;
    db.run("DELETE FROM funcionarios WHERE id = ?", [id], function (err) {
        if (err) {
            console.error('Erro ao excluir funcionário:', err);
            res.status(500).send('Erro ao excluir funcionário');
        } else {
            res.send('Funcionário excluído com sucesso!');
        }
    });
});





// Teste para verificar se o servidor está rodando
app.get('/', (req, res) => {
    res.send('Servidor está rodando e tabelas criadas!');
});

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

