const express = require("express");
const router = express.Router();
const conexao = require("../database");

const DATA_INICIO = "2026-11-30";
const DATA_FIM = "2026-12-04";
const LIMITE_POR_DIA = 4;

// =====================================
// 1. LISTAR PEÇAS
// =====================================

router.get("/", async (req, res) => {
    try {
        const [pecas] = await conexao.query(`
            SELECT
                peca.id_peca,
                peca.nome,
                DATE_FORMAT(peca.data_peca, '%Y-%m-%d') AS data_peca,
                peca.id_turma,
                turma.identificacao AS turma,
                curso.nome AS curso
            FROM peca
            INNER JOIN turma
                ON peca.id_turma = turma.id_turma
            INNER JOIN curso
                ON turma.id_curso = curso.id_curso
            ORDER BY peca.data_peca, turma.identificacao
        `);

        res.json(pecas);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao listar peças."
        });
    }
});

// =====================================
// 2. CADASTRAR PEÇA
// =====================================

router.post("/", async (req, res) => {
    const { nome, data_peca, id_turma } = req.body;

    if (!nome || !data_peca || !id_turma) {
        return res.status(400).json({
            mensagem: "Preencha todos os campos."
        });
    }

    const nomePeca = nome.trim();
    const turmaId = Number(id_turma);

    if (!nomePeca) {
        return res.status(400).json({
            mensagem: "O nome da peça é obrigatório."
        });
    }

    if (!Number.isInteger(turmaId) || turmaId <= 0) {
        return res.status(400).json({
            mensagem: "Selecione uma turma válida."
        });
    }

    // Janela permitida: 30/11/2026 até 04/12/2026
    if (data_peca < DATA_INICIO || data_peca > DATA_FIM) {
        return res.status(400).json({
            mensagem: "A data deve estar entre 30/11/2026 e 04/12/2026."
        });
    }

    try {
        // Verifica se a turma existe e está inscrita na JAC
        const [turmas] = await conexao.query(
            `SELECT id_turma, inscrita_jac
             FROM turma
             WHERE id_turma = ?`,
            [turmaId]
        );

        if (turmas.length === 0) {
            return res.status(404).json({
                mensagem: "Turma não encontrada."
            });
        }

        if (!turmas[0].inscrita_jac) {
            return res.status(400).json({
                mensagem: "A turma selecionada não está inscrita na JAC."
            });
        }

        // Regra: uma turma só pode ter uma peça
        const [pecaDaTurma] = await conexao.query(
            "SELECT id_peca FROM peca WHERE id_turma = ?",
            [turmaId]
        );

        if (pecaDaTurma.length > 0) {
            return res.status(400).json({
                mensagem: "Esta turma já possui uma peça cadastrada."
            });
        }

        // Regra: no máximo 4 peças por dia
        const [contagem] = await conexao.query(
            "SELECT COUNT(*) AS total FROM peca WHERE data_peca = ?",
            [data_peca]
        );

        if (contagem[0].total >= LIMITE_POR_DIA) {
            return res.status(400).json({
                mensagem: "Este dia já possui 4 peças cadastradas."
            });
        }

        const [resultado] = await conexao.query(
            `INSERT INTO peca (nome, data_peca, id_turma)
             VALUES (?, ?, ?)`,
            [nomePeca, data_peca, turmaId]
        );

        res.status(201).json({
            mensagem: "Peça cadastrada com sucesso!",
            id_peca: resultado.insertId
        });

    } catch (erro) {
        console.error(erro);

        if (erro.code === "ER_DUP_ENTRY") {
            return res.status(400).json({
                mensagem: "Esta turma já possui uma peça cadastrada."
            });
        }

        if (erro.code === "ER_NO_REFERENCED_ROW_2") {
            return res.status(400).json({
                mensagem: "A turma selecionada não existe."
            });
        }

        res.status(500).json({
            mensagem: "Erro ao cadastrar peça."
        });
    }
});

module.exports = router;