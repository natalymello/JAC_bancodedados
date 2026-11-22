
const express = require("express");
const router = express.Router();
const conexao = require("../database");

// LISTAR TURMAS E SEUS CURSOS
router.get("/", async (req, res) => {
    try {
        const [turmas] = await conexao.query(`
            SELECT
                turma.id_turma,
                turma.identificacao,
                turma.id_curso,
                curso.nome AS curso
            FROM turma
            INNER JOIN curso
                ON turma.id_curso = curso.id_curso
            ORDER BY curso.nome, turma.identificacao
        `);

        res.json(turmas);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao consultar turmas."
        });
    }
});

module.exports = router;
