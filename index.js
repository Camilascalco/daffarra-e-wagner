const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { body, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cors());

// Conexão com o banco de dados
const db = new sqlite3.Database('clinica_veterinaria.db');

// Middleware de tratamento de erros
const handleErrors = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

// Middleware de validação
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

// Criação das tabelas
db.serialize(() => {
    // Tabela Clientes com índices
    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT UNIQUE NOT NULL,
            telefone TEXT NOT NULL,
            email TEXT NOT NULL,
            endereco TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    db.run('CREATE INDEX IF NOT EXISTS idx_clientes_cpf ON clientes(cpf)');

    // Tabela Animais com índices
    db.run(`
        CREATE TABLE IF NOT EXISTS animais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            especie TEXT NOT NULL,
            raca TEXT NOT NULL,
            data_nascimento DATE NOT NULL,
            cliente_cpf TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cliente_cpf) REFERENCES clientes(cpf)
        )
    `);
    db.run('CREATE INDEX IF NOT EXISTS idx_animais_cliente ON animais(cliente_cpf)');

    // Tabela Funcionários com índices
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
            setor TEXT NOT NULL,
            status TEXT DEFAULT 'ativo',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    db.run('CREATE INDEX IF NOT EXISTS idx_funcionarios_cpf ON funcionarios(cpf)');

    // Tabela Consultas com índices
    db.run(`
        CREATE TABLE IF NOT EXISTS consultas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE NOT NULL,
            hora TIME NOT NULL,
            tipo_consulta TEXT NOT NULL,
            observacao TEXT,
            status TEXT DEFAULT 'agendada',
            cliente_cpf TEXT,
            animal_id INTEGER,
            funcionario_cpf TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cliente_cpf) REFERENCES clientes(cpf),
            FOREIGN KEY (animal_id) REFERENCES animais(id),
            FOREIGN KEY (funcionario_cpf) REFERENCES funcionarios(cpf)
        )
    `);
    db.run('CREATE INDEX IF NOT EXISTS idx_consultas_data ON consultas(data)');
    db.run('CREATE INDEX IF NOT EXISTS idx_consultas_cliente ON consultas(cliente_cpf)');

    // Tabela Prontuários com índices
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
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (animal_id) REFERENCES animais(id),
            FOREIGN KEY (funcionario_cpf) REFERENCES funcionarios(cpf)
        )
    `);
    db.run('CREATE INDEX IF NOT EXISTS idx_prontuarios_animal ON prontuarios(animal_id)');
});

// Validações
const clienteValidation = [
    body('nome').notEmpty().trim().isLength({ min: 3 }),
    body('cpf').notEmpty().matches(/^\d{11}$/),
    body('telefone').notEmpty().matches(/^\d{10,11}$/),
    body('email').isEmail(),
    body('endereco').notEmpty()
];

const animalValidation = [
    body('nome').notEmpty().trim(),
    body('especie').notEmpty(),
    body('raca').notEmpty(),
    body('data_nascimento').isDate(),
    body('cliente_cpf').notEmpty().matches(/^\d{11}$/)
];

// Rotas de Clientes
app.post('/cadastrar-cliente', clienteValidation, validate, async (req, res) => {
    const { nome, cpf, telefone, email, endereco } = req.body;
    try {
        await db.run(
            "INSERT INTO clientes (nome, cpf, telefone, email, endereco) VALUES (?, ?, ?, ?, ?)",
            [nome, cpf, telefone, email, endereco]
        );
        res.json({
            success: true,
            message: 'Cliente cadastrado com sucesso!'
        });
    } catch (err) {
        next(err);
    }
});

// Rotas de Prontuários
app.get('/consultar-prontuarios', async (req, res) => {
    const { data, especie } = req.query;
    try {
        let sql = `
            SELECT 
                p.*,
                a.nome as nome_animal,
                f.nome as nome_veterinario
            FROM prontuarios p
            LEFT JOIN animais a ON p.animal_id = a.id
            LEFT JOIN funcionarios f ON p.funcionario_cpf = f.cpf
            WHERE 1=1
        `;
        const params = [];

        if (data) {
            sql += " AND p.data = ?";
            params.push(data);
        }
        if (especie) {
            sql += " AND p.especie_animal = ?";
            params.push(especie);
        }

        sql += " ORDER BY p.data DESC, p.id DESC";

        const prontuarios = await db.all(sql, params);
        res.json({
            success: true,
            data: prontuarios
        });
    } catch (err) {
        next(err);
    }
});

app.post('/cadastrar-prontuario', async (req, res) => {
    const {
        data,
        especie_animal,
        porte,
        raca_animal,
        peso_animal,
        alergias,
        vacinas,
        historico_medico,
        diagnostico,
        tratamento,
        animal_id,
        funcionario_cpf
    } = req.body;

    try {
        await db.run(`
            INSERT INTO prontuarios (
                data, especie_animal, porte, raca_animal, peso_animal,
                alergias, vacinas, historico_medico, diagnostico,
                tratamento, animal_id, funcionario_cpf
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            data, especie_animal, porte, raca_animal, peso_animal,
            alergias, vacinas, historico_medico, diagnostico,
            tratamento, animal_id, funcionario_cpf
        ]);

        res.json({
            success: true,
            message: 'Prontuário cadastrado com sucesso!'
        });
    } catch (err) {
        next(err);
    }
});

// Middleware de erro
app.use(handleErrors);

// Inicialização do servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

// Função para fechar o banco de dados quando o servidor for encerrado
process.on('SIGINT', () => {
    db.close(() => {
        console.log('Conexão com o banco de dados fechada');
        process.exit(0);
    });
});

