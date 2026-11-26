// =====================================
// CONFIGURAÇÃO E ELEMENTOS DA PÁGINA
// =====================================

const API = "http://localhost:3000/api";

const formulario = document.getElementById("elencoForm");
const campoPeca = document.getElementById("peca");
const campoEstudante = document.getElementById("estudante");
const campoFuncao = document.getElementById("funcao");
const mensagem = document.getElementById("mensagem");
const tabela = document.getElementById("elencoTable");

// =====================================
// INTEGRAÇÃO ESPERADA COM O BACK-END
// =====================================
// GET  /api/pecas
//   -> Lista peças para o select.
//   -> Resposta esperada: [{ id_peca, nome, data_peca, turma, curso }, ...]
//
// GET  /api/estudantes
//   -> Lista estudantes para o select.
//   -> Resposta esperada: [{ id_estudante, nome, matricula, turma, curso }, ...]
//
// GET  /api/elenco
//   -> Lista vínculos do elenco.
//   -> Resposta esperada: [{ id_elenco, id_peca, peca, id_estudante, estudante, funcao }, ...]
//
// POST /api/elenco
//   -> Cadastra vínculo no elenco.
//   -> Body esperado: { id_peca, id_estudante, funcao }
//   -> Resposta esperada: { mensagem, id_elenco }
//
// Observação:
// - Confirme com quem fizer o back-end se o endpoint será /api/elenco ou /api/elencos.
// - O importante é manter front e back com o mesmo caminho.

// =====================================
// 1. CARREGAR PEÇAS
// =====================================

async function carregarPecas() {
    campoPeca.innerHTML = '<option value="">Carregando peças...</option>';
    campoPeca.disabled = true;

    try {
        const resposta = await fetch(`${API}/pecas`);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar as peças.");
        }

        const pecas = await resposta.json();

        campoPeca.innerHTML = '<option value="">Selecione uma peça</option>';

        if (!Array.isArray(pecas) || pecas.length === 0) {
            campoPeca.innerHTML = '<option value="">Nenhuma peça cadastrada</option>';
            return;
        }

        pecas.forEach((peca) => {
            const opcao = document.createElement("option");

            opcao.value = peca.id_peca;
            opcao.textContent = `${peca.nome} - ${peca.turma}`;

            campoPeca.appendChild(opcao);
        });

        campoPeca.disabled = false;

    } catch (erro) {
        console.error(erro);
        campoPeca.innerHTML = '<option value="">Erro ao carregar peças</option>';
    }
}

// =====================================
// 2. CARREGAR ESTUDANTES
// =====================================

async function carregarEstudantes() {
    campoEstudante.innerHTML = '<option value="">Carregando estudantes...</option>';
    campoEstudante.disabled = true;

    try {
        const resposta = await fetch(`${API}/estudantes`);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar os estudantes.");
        }

        const estudantes = await resposta.json();

        campoEstudante.innerHTML = '<option value="">Selecione um estudante</option>';

        if (!Array.isArray(estudantes) || estudantes.length === 0) {
            campoEstudante.innerHTML =
                '<option value="">Nenhum estudante cadastrado</option>';
            return;
        }

        estudantes.forEach((estudante) => {
            const opcao = document.createElement("option");

            opcao.value = estudante.id_estudante;
            opcao.textContent = `${estudante.nome} - ${estudante.turma}`;

            campoEstudante.appendChild(opcao);
        });

        campoEstudante.disabled = false;

    } catch (erro) {
        console.error(erro);
        campoEstudante.innerHTML =
            '<option value="">Erro ao carregar estudantes</option>';
    }
}

// =====================================
// 3. LISTAR ELENCO
// =====================================

async function carregarElenco() {
    tabela.innerHTML = `
        <tr>
            <td colspan="3">Carregando elenco...</td>
        </tr>
    `;

    try {
        const resposta = await fetch(`${API}/elenco`);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o elenco.");
        }

        const elenco = await resposta.json();

        tabela.innerHTML = "";

        if (!Array.isArray(elenco) || elenco.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="3">Nenhum registro no elenco.</td>
                </tr>
            `;
            return;
        }

        elenco.forEach((item) => {
            const linha = document.createElement("tr");

            const colunaPeca = document.createElement("td");
            colunaPeca.textContent = item.peca;

            const colunaEstudante = document.createElement("td");
            colunaEstudante.textContent = item.estudante;

            const colunaFuncao = document.createElement("td");
            colunaFuncao.textContent = item.funcao;

            linha.appendChild(colunaPeca);
            linha.appendChild(colunaEstudante);
            linha.appendChild(colunaFuncao);

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error(erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="3">Erro ao carregar elenco.</td>
            </tr>
        `;
    }
}

// =====================================
// 4. CADASTRAR NO ELENCO
// =====================================

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const id_peca = campoPeca.value;
    const id_estudante = campoEstudante.value;
    const funcao = campoFuncao.value.trim();

    mensagem.textContent = "";
    mensagem.style.color = "";

    if (!id_peca || !id_estudante || !funcao) {
        mensagem.textContent = "Preencha todos os campos.";
        mensagem.style.color = "red";
        return;
    }

    try {
        const resposta = await fetch(`${API}/elenco`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_peca,
                id_estudante,
                funcao
            })
        });

        const resultado = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || "Erro ao cadastrar no elenco.");
        }

        mensagem.textContent = resultado.mensagem || "Cadastro realizado com sucesso!";
        mensagem.style.color = "green";

        formulario.reset();
        await carregarElenco();

    } catch (erro) {
        console.error(erro);
        mensagem.textContent = erro.message;
        mensagem.style.color = "red";
    }
});

// =====================================
// 5. INICIALIZAR PÁGINA
// =====================================

carregarPecas();
carregarEstudantes();
carregarElenco();