
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

// Carrega as configurações do arquivo .env
dotenv.config({
    path: path.resolve(__dirname, "../.env")
});

// Configura a conexão com o banco
const conexao = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = conexao;
