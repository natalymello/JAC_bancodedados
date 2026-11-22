
const express = require("express");
const router = express.Router();
const conexao = require("../database");

// =====================================
// 1. LISTAR ESTUDANTES
// =====================================

router.get("/", async (req, res) => {
    try {
        const [estudantes] = await conexao.query(`
            SELECT
                estudante.id_estudante,
                estudante.nome,
                estudante.matricula,
                estudante.id_turma,
                turma.identificacao AS turma,
                curso.nome AS curso
            FROM estudante
            INNER JOIN turma
                ON estudante.id_turma = turma.id_turma
            INNER JOIN curso
                ON turma.id_curso = curso.id_curso
            ORDER BY estudante.nome
        `);

        res.json(estudantes);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao listar estudantes."
        });
    }
});


// =====================================
// 2. CADASTRAR ESTUDANTE
// =====================================

router.post("/", async (req, res) => {

    const { nome, matricula, id_turma } = req.body;

    if (!nome || !matricula || !id_turma) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos."
        });
    }

    const turmaId = Number(id_turma);

    if (!Number.isInteger(turmaId) || turmaId <= 0) {
        return res.status(400).json({
            mensagem: "Selecione uma turma válida."
        });
    }

    try {
        const [resultado] = await conexao.query(
            `INSERT INTO estudante (nome, matricula, id_turma)
             VALUES (?, ?, ?)`,
            [nome.trim(), matricula.trim(), turmaId]
        );

        res.status(201).json({
            mensagem: "Estudante cadastrado com sucesso!",
            id_estudante: resultado.insertId
        });

    } catch (erro) {
        console.error(erro);

        if (erro.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                mensagem: "A turma selecionada não existe."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao cadastrar estudante."
        });
    }
});

module.exports = router;
