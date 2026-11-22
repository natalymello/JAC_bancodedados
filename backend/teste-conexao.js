
const conexao = require("./database");

async function testarConexao() {
    try {
        const [resultado] = await conexao.query(
            "SHOW TABLES"
        );

        console.log("Conexão com MySQL realizada!");

        console.log("Tabelas encontradas no banco:");

        console.table(resultado);

    } catch (erro) {
        console.error("Erro ao conectar com MySQL:");
        console.error(erro.message);

    } finally {
        await conexao.end();
    }
}

testarConexao();
