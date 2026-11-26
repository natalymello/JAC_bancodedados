CREATE DATABASE IF NOT EXISTS jac;
USE jac;

-- 1. Tabela Curso
CREATE TABLE IF NOT EXISTS curso (
    id_curso INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- 2. Tabela Turma
CREATE TABLE IF NOT EXISTS turma (
    id_turma INT AUTO_INCREMENT PRIMARY KEY,
    identificacao VARCHAR(50) NOT NULL,
    id_curso INT NOT NULL,
    inscrita_jac BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (id_curso)
        REFERENCES curso(id_curso)
);

-- 3. Tabela Orientador
CREATE TABLE IF NOT EXISTS orientador (
    id_orientador INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    id_turma INT NOT NULL,

    FOREIGN KEY (id_turma)
        REFERENCES turma(id_turma)
);

-- 4. Tabela Estudante
CREATE TABLE IF NOT EXISTS estudante (
    id_estudante INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    matricula VARCHAR(30) NOT NULL UNIQUE,
    id_turma INT NOT NULL,

    FOREIGN KEY (id_turma)
        REFERENCES turma(id_turma)
);

-- 5. Tabela Peca
CREATE TABLE IF NOT EXISTS peca (
    id_peca INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_peca DATE NOT NULL,
    id_turma INT NOT NULL UNIQUE,

    FOREIGN KEY (id_turma)
        REFERENCES turma(id_turma)
);

-- 6. Tabela Elenco
CREATE TABLE IF NOT EXISTS elenco (
    id_elenco INT AUTO_INCREMENT PRIMARY KEY,
    id_estudante INT NOT NULL,
    id_peca INT NOT NULL,
    funcao VARCHAR(100) NOT NULL,

    FOREIGN KEY (id_estudante)
        REFERENCES estudante(id_estudante),

    FOREIGN KEY (id_peca)
        REFERENCES peca(id_peca)
);

-- DADOS FICTIONAIS --- TESTE

-- 1. CURSOS
INSERT INTO curso (nome) VALUES
('Informática'),
('Química');

-- 2. TURMAS
INSERT INTO turma (identificacao, id_curso) VALUES
('Informatica P4', 1),
('Informatica P3', 1),
('Quimica P4', 2);

-- 3. ORIENTADORES
INSERT INTO orientador (nome, id_turma) VALUES
('Oliver Carvalho', 1),
('Joao Lucas', 1),
('Pedro Santos', 3);

-- 4. ESTUDANTES
INSERT INTO estudante (nome, matricula, id_turma) VALUES
('Geovana Moreira', '2026001', 1),
('Joao Arthur', '2026002', 1),
('Pablo Militante', '2026003', 2),
('Shopia Santos', '2026004', 2),
('Rafael Mendes', '2026005', 3),
('Camila Rocha', '2026006', 3);

-- 5. PEÇAS
INSERT INTO peca (nome, data_peca, id_turma) VALUES
('MISANTROPIA', '2026-12-03', 1),
('Capitaes de areia', '2026-12-04', 2),
('Quero ser nailah', '2026-12-02', 3);

-- 6. ELENCO
INSERT INTO elenco (id_estudante, id_peca, funcao) VALUES
(1, 1, 'Atriz'),
(2, 1, 'Roterista'),
(1, 2, 'Direcao de cena'),
(3, 2, 'Ator'),
(4, 2, 'Figurinista'),
(5, 3, 'Ator'),
(6, 3, 'Cenografa');
