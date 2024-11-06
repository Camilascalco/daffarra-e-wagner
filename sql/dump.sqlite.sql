-- TABLE
CREATE TABLE demo (ID integer primary key, Name varchar(20), Hint text );
CREATE TABLE funcionario(
    id integer PRIMARY KEY AUTOINCREMENT,
    nome text NOT NULL,
    email text NOT NULL,
    telefone varchar(30),
    cpf varchar(100),
    data_nascimento varchar(20),
    cep varchar(50),
    data_admissao varchar(40),
    carteira_trabalho varchar(90),
    setor varchar(80)
    );
CREATE TABLE tutor(
  id integer PRIMARY KEY AUTOINCREMENT,
  endereço text NOT NULL,
  nome text NOT NULL,
  telefone text NOT NULL,
  cpf text NOT NULL,
  email text NOT NULL
  );
 
-- INDEX
 
-- TRIGGER
 
-- VIEW
 
