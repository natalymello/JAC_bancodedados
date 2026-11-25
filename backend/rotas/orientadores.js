
const express = require("express");
const router = express.Router();
const conexao = require("../database");

// =====================================
// 1. LISTAR ORIENTADORES
// =====================================

router.get("/", async (req, res) => {
    try {
        const [orientadores] = await conexao.query(`
            SELECT
                orientador.id_orientador,
                orientador.nome,
                orientador.id_turma,
                turma.identificacao AS turma,
                curso.nome AS curso
            FROM orientador
            INNER JOIN turma
                ON orientador.id_turma = turma.id_turma
            INNER JOIN curso
                ON turma.id_curso = curso.id_curso
            ORDER BY orientador.nome
        `);

        res.json(orientadores);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao listar orientadores."
        });
    }
});


// =====================================
// 2. CADASTRAR ORIENTADOR
// =====================================

router.post("/", async (req, res) => {

    const { nome, id_turma } = req.body;

    if (!nome || !id_turma) {
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
            `INSERT INTO orientador (nome, id_turma)
             VALUES (?, ?)`,
            [nome.trim(), turmaId]
        );

        res.status(201).json({
            mensagem: "Orientador cadastrado com sucesso!",
            id_orientador: resultado.insertId
        });

    } catch (erro) {
        console.error(erro);

        if (erro.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                mensagem: "A turma selecionada não existe."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao cadastrar orientador."
        });
    }
});

module.exports = router;
