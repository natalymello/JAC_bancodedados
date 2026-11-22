
const express = require("express");
const cors = require("cors");
const conexao = require("./database");
const estudantesRoutes = require("./rotas/estudantes");
const turmasRoutes = require("./rotas/turmas");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/estudantes", estudantesRoutes);
app.use("/api/turmas", turmasRoutes);

// Rota para testar o servidor e o banco
app.get("/api/teste", async (req, res) => {
    try {
        const [resultado] = await conexao.query(
            "SELECT DATABASE() AS banco"
        );

        res.json({
            mensagem: "Servidor e banco conectados!",
            banco: resultado[0].banco
        });

    } catch (erro) {
        res.status(500).json({
            mensagem: "Erro ao acessar o banco de dados.",
            erro: erro.message
        });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
