
const express = require("express");
const router = express.Router();
const conexao = require("../database");

// =====================================
// 1. LISTAR ELENCO
// =====================================

router.get("/", async (req, res) => {
    try {
        const [resultado] = await conexao.query(`
            SELECT
                elenco.id_elenco,
                elenco.id_peca,
                elenco.id_estudante,
                elenco.funcao,
                estudante.nome AS estudante,
                peca.nome AS peca
            FROM elenco
            INNER JOIN estudante
                ON elenco.id_estudante = estudante.id_estudante
            INNER JOIN peca
                ON elenco.id_peca = peca.id_peca
            ORDER BY peca.nome, estudante.nome
        `);

        res.json(resultado);

    } catch (erro) {
        console.error("Erro ao buscar elenco:", erro);

        res.status(500).json({
            mensagem: "Erro ao buscar elenco."
        });
    }
});


// =====================================
// 2. CADASTRAR NO ELENCO
// =====================================

router.post("/", async (req, res) => {
    try {
        const { id_peca, id_estudante, funcao } = req.body;

        if (!id_peca || !id_estudante || !funcao || !funcao.trim()) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos."
            });
        }

        const [pecas] = await conexao.query(
            "SELECT id_peca FROM peca WHERE id_peca = ?",
            [id_peca]
        );

        if (pecas.length === 0) {
            return res.status(404).json({
                mensagem: "Peça não encontrada."
            });
        }

        const [estudantes] = await conexao.query(
            "SELECT id_estudante FROM estudante WHERE id_estudante = ?",
            [id_estudante]
        );

        if (estudantes.length === 0) {
            return res.status(404).json({
                mensagem: "Estudante não encontrado."
            });
        }

        const [duplicado] = await conexao.query(
            `SELECT id_elenco
             FROM elenco
             WHERE id_peca = ? AND id_estudante = ?`,
            [id_peca, id_estudante]
        );

        if (duplicado.length > 0) {
            return res.status(409).json({
                mensagem: "Esse estudante já está cadastrado nessa peça."
            });
        }

        const [resultado] = await conexao.query(
            `INSERT INTO elenco (id_peca, id_estudante, funcao)
             VALUES (?, ?, ?)`,
            [id_peca, id_estudante, funcao.trim()]
        );

        return res.status(201).json({
            mensagem: "Integrante cadastrado com sucesso!",
            id_elenco: resultado.insertId
        });

    } catch (erro) {
        console.error("Erro ao cadastrar elenco:", erro);

        return res.status(500).json({
            mensagem: "Erro interno ao cadastrar elenco.",
            erro: erro.message
        });
    }
});

module.exports = router;
