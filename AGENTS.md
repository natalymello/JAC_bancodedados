# Instruções do projeto — JAC (Gestão de Artes Cênicas)

Sistema web para gerenciar cursos, turmas, orientadores, estudantes, peças e elenco do projeto JAC.
A aplicação é composta por um front-end estático e uma API REST em Express que conversa com MySQL.

## Stack e estrutura

- **Front-end:** HTML + CSS + JavaScript puro (sem framework), sem build.
  - `index.html` — painel inicial
  - `pages/` — páginas (turmas, orientadores, estudantes)
  - `css/` — `style.css` (layout) e `components.css` (componentes)
  - `js/` — um arquivo de script por página/feature (`main.js`, `turmas.js`, `estudantes.js`, `orientadores.js`, `peca.js`, `elenco.js`)
- **Back-end:** Node.js + Express 5 + `mysql2/promise`, CommonJS (`require` / `module.exports`).
  - `backend/server.js` — inicializa a API, registra os routers e o endpoint `/api/teste`
  - `backend/database.js` — pool de conexão MySQL, lê `.env` da raiz
  - `backend/rotas/` — um router por recurso (`estudantes`, `turmas`, `orientadores`, `inscricoes`)
  - `backend/teste-conexao.js` — script para diagnosticar a conexão e listar tabelas
- **Banco:** MySQL, schema e dados de exemplo em `jac.sql` na raiz.
- **Dependências:** `package.json` / `package-lock.json`. `node_modules/` e `.env` estão no `.gitignore`.

## Como executar

```bash
npm install
# crie .env na raiz com DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (PORT é opcional, padrão 3000)
# importe o schema: mysql -u <usuario> -p < jac.sql
node backend/teste-conexao.js   # verifica conexão e lista tabelas
node backend/server.js          # sobe a API em http://localhost:3000
```

Não há script `start` nem suíte de testes configurada (`npm test` é apenas um placeholder que falha).
Após alterar o back-end, reinicie o servidor e valide manualmente os endpoints afetados (por exemplo,
`GET http://localhost:3000/api/teste`).

## Convenções de código

- Escreva código, comentários, mensagens de erro e respostas da API em **português (pt-BR)**.
- Nomes de variáveis, parâmetros e campos também usam pt-BR: `nome`, `matricula`, `id_turma`,
  `carregarEstudantes`, `renderizarTurmas`.
- Use `const`/`let`, `async/await` e `try/catch`. Recursos do Express são registrados com
  `router.get/post/delete` e exportados com `module.exports = router`.
- Identação de 4 espaços, aspas duplas e blocos de comentário de seção (`// ====`) para separar
  etapas em arquivos longos.
- Consultas SQL usam `conexao.query()` do `mysql2/promise`, sempre com placeholders `?` e array de
  valores — nunca interpole entrada do usuário diretamente na string.
- Valide entradas antes do banco: campos obrigatórios, `Number.isInteger()` para IDs e `trim()` em
  strings. Responda `400` para dados inválidos, `404` para recurso inexistente e `500` para falha
  de banco, sempre com `{ mensagem: "..." }`.
- Registre erros com `console.error(erro)` no servidor, sem devolver detalhes internos ao cliente.
- No front-end, cada página carrega apenas os scripts de que precisa. Chamadas à API usam `fetch`
  com `Content-Type: application/json` em POST e atualizam a tabela/mensagem após a resposta.

## Banco de dados

Tabelas do schema `jac`: `curso`, `turma`, `orientador`, `estudante`, `peca`, `elenco`.
Chaves primárias seguem o padrão `id_<tabela>` (`id_curso`, `id_turma`, etc.) e relações são feitas
por foreign keys. `peca.id_turma` é única — uma turma tem no máximo uma peça.

Atenção ao manter código e schema alinhados: `backend/rotas/inscricoes.js` consulta e altera
`turma.inscrita_jac`, coluna que ainda não aparece em `jac.sql`. Antes de mexer em inscrições,
confirme a estrutura real do banco (`node backend/teste-conexao.js` / `DESCRIBE turma;`) e
atualize o SQL e as rotas juntos, sem alterar o schema silenciosamente.

## Pendências conhecidas

- `index.html` referencia `pages/pecas.html` e `pages/elenco.html`, que ainda não existem;
  `js/peca.js` e `js/elenco.js` estão vazios.
- Alguns links do menu em `pages/estudantes.html` apontam para `../index.html` em vez das
  páginas correspondentes.
- `index.html` não fecha as tags `section`, `main`, `div` e `body` — confira o HTML ao mexer no layout.

## Regras de trabalho

- Não comite `.env` nem `node_modules/`. Nunca exponha credenciais do banco em logs ou no código.
- Preserve o estilo existente ao editar arquivos; não converta o projeto para TypeScript, módulos
  ESM ou um framework sem pedido explícito.
- Ao adicionar um recurso novo, siga o padrão: tabela em `jac.sql`, router em `backend/rotas/`,
  registro em `backend/server.js`, página em `pages/` e script em `js/`.
- Prefira mudanças pequenas e verificáveis. Depois de editar, aponte quais comandos/endpoints foram
  usados para validar a alteração.
