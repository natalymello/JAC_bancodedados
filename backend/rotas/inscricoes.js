
const express = require("express");
const router = express.Router();
const conexao = require("../database");

// =====================================
// 1. LISTAR TURMAS INSCRITAS
// =====================================

router.get("/", async (req, res) => {
    try {
        const [turmas] = await conexao.query(`
            SELECT
                turma.id_turma,
                turma.identificacao,
                curso.nome AS curso
            FROM turma
            INNER JOIN curso
                ON turma.id_curso = curso.id_curso
            WHERE turma.inscrita_jac = TRUE
            ORDER BY curso.nome, turma.identificacao
        `);

        res.json(turmas);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao listar turmas inscritas."
        });
    }
});


// =====================================
// 2. LISTAR TURMAS DISPONÍVEIS
// =====================================

router.get("/disponiveis", async (req, res) => {
    try {
        const [turmas] = await conexao.query(`
            SELECT
                turma.id_turma,
                turma.identificacao,
                curso.nome AS curso
            FROM turma
            INNER JOIN curso
                ON turma.id_curso = curso.id_curso
            WHERE turma.inscrita_jac = FALSE
            ORDER BY curso.nome, turma.identificacao
        `);

        res.json(turmas);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao listar turmas disponíveis."
        });
    }
});


// =====================================
// 3. INSCREVER TURMA NA JAC
// =====================================

router.post("/", async (req, res) => {

    const turmaId = Number(req.body.id_turma);

    if (!Number.isInteger(turmaId) || turmaId <= 0) {
        return res.status(400).json({
            mensagem: "Selecione uma turma válida."
        });
    }

    try {
        const [turmas] = await conexao.query(
            "SELECT inscrita_jac FROM turma WHERE id_turma = ?",
            [turmaId]
        );

        if (turmas.length === 0) {
            return res.status(404).json({
                mensagem: "Turma não encontrada."
            });
        }

        if (turmas[0].inscrita_jac) {
            return res.status(400).json({
                mensagem: "Esta turma já está inscrita na JAC."
            });
        }

        await conexao.query(
            `UPDATE turma
             SET inscrita_jac = TRUE
             WHERE id_turma = ?`,
            [turmaId]
        );

        res.json({
            mensagem: "Turma inscrita na JAC com sucesso!"
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao inscrever turma."
        });
    }
});


// =====================================
// 4. REMOVER INSCRIÇÃO DA TURMA
// =====================================

router.delete("/:id_turma", async (req, res) => {

    const turmaId = Number(req.params.id_turma);

    if (!Number.isInteger(turmaId) || turmaId <= 0) {
        return res.status(400).json({
            mensagem: "ID de turma inválido."
        });
    }

    try {
        const [resultado] = await conexao.query(
            `UPDATE turma
             SET inscrita_jac = FALSE
             WHERE id_turma = ?`,
            [turmaId]
        );

        if (resultado.affectedRows === 0) {
            const [turmas] = await conexao.query(
                "SELECT id_turma FROM turma WHERE id_turma = ?",
                [turmaId]
            );

            if (turmas.length === 0) {
                return res.status(404).json({
                    mensagem: "Turma não encontrada."
                });
            }
        }

        res.json({
            mensagem: "Inscrição removida com sucesso!"
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao remover inscrição."
        });
    }
});

module.exports = router;
