// =====================================
// CONFIGURAÇÃO E ELEMENTOS DA PÁGINA
// =====================================

const API = "http://localhost:3000/api";

const formulario = document.getElementById("pecaForm");
const campoNome = document.getElementById("nome");
const campoData = document.getElementById("dataPeca");
const campoTurma = document.getElementById("turma");
const mensagem = document.getElementById("mensagem");
const tabela = document.getElementById("pecasTable");

// Janela de datas permitida para apresentação.
// O back-end também deve validar essa regra.
const DATA_INICIO = "2026-11-30";
const DATA_FIM = "2026-12-04";

// =====================================
// INTEGRAÇÃO ESPERADA COM O BACK-END
// =====================================
// GET  /api/inscricoes
//   -> Lista turmas inscritas na JAC.
//   -> Resposta esperada: [{ id_turma, identificacao, curso }, ...]
//
// GET  /api/pecas
//   -> Lista peças cadastradas.
//   -> Resposta esperada: [{ id_peca, nome, data_peca, id_turma, turma, curso }, ...]
//
// POST /api/pecas
//   -> Cadastra uma peça.
//   -> Body esperado: { nome, data_peca, id_turma }
//   -> Resposta esperada: { mensagem, id_peca }
//
// Regras que o back-end deve garantir:
// - Apenas turmas inscritas na JAC podem cadastrar peça.
// - data_peca deve estar entre 30/11/2026 e 04/12/2026.
// - Máximo de 4 peças por dia.
// - Uma turma pode ter no máximo 1 peça (peca.id_turma é UNIQUE).

// =====================================
// 1. CARREGAR TURMAS INSCRITAS NA JAC
// =====================================

async function carregarTurmasInscritas() {
    campoTurma.innerHTML = '<option value="">Carregando turmas...</option>';
    campoTurma.disabled = true;

    try {
        const resposta = await fetch(`${API}/inscricoes`);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar as turmas inscritas.");
        }

        const turmas = await resposta.json();

        campoTurma.innerHTML = '<option value="">Selecione uma turma</option>';

        if (!Array.isArray(turmas) || turmas.length === 0) {
            campoTurma.innerHTML =
                '<option value="">Nenhuma turma inscrita na JAC</option>';
            return;
        }

        turmas.forEach((turma) => {
            const opcao = document.createElement("option");

            opcao.value = turma.id_turma;
            opcao.textContent = `${turma.identificacao} - ${turma.curso}`;

            campoTurma.appendChild(opcao);
        });

        campoTurma.disabled = false;

    } catch (erro) {
        console.error(erro);

        campoTurma.innerHTML =
            '<option value="">Erro ao carregar turmas</option>';
    }
}

// =====================================
// 2. FORMATAR DATA PARA EXIBIÇÃO
// =====================================

function formatarData(data) {
    if (!data || typeof data !== "string") {
        return "";
    }

    const dataISO = data.slice(0, 10);
    const partes = dataISO.split("-");

    if (partes.length !== 3) {
        return data;
    }

    const [ano, mes, dia] = partes;
    return `${dia}/${mes}/${ano}`;
}

// =====================================
// 3. LISTAR PEÇAS
// =====================================

async function carregarPecas() {
    tabela.innerHTML = `
        <tr>
            <td colspan="4">Carregando peças...</td>
        </tr>
    `;

    try {
        const resposta = await fetch(`${API}/pecas`);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar as peças.");
        }

        const pecas = await resposta.json();

        tabela.innerHTML = "";

        if (!Array.isArray(pecas) || pecas.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="4">Nenhuma peça cadastrada.</td>
                </tr>
            `;
            return;
        }

        pecas.forEach((peca) => {
            const linha = document.createElement("tr");

            const colunaNome = document.createElement("td");
            colunaNome.textContent = peca.nome;

            const colunaData = document.createElement("td");
            colunaData.textContent = formatarData(peca.data_peca);

            const colunaTurma = document.createElement("td");
            colunaTurma.textContent = peca.turma;

            const colunaCurso = document.createElement("td");
            colunaCurso.textContent = peca.curso;

            linha.appendChild(colunaNome);
            linha.appendChild(colunaData);
            linha.appendChild(colunaTurma);
            linha.appendChild(colunaCurso);

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error(erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="4">Erro ao carregar peças.</td>
            </tr>
        `;
    }
}

// =====================================
// 4. VALIDAR FORMULÁRIO NO FRONT-END
// =====================================

function validarFormulario(nome, dataPeca, idTurma) {
    if (!nome || !dataPeca || !idTurma) {
        return "Preencha todos os campos.";
    }

    if (dataPeca < DATA_INICIO || dataPeca > DATA_FIM) {
        return "A data deve estar entre 30/11/2026 e 04/12/2026.";
    }

    return "";
}

// =====================================
// 5. CADASTRAR PEÇA
// =====================================

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    const nome = campoNome.value.trim();
    const data_peca = campoData.value;
    const id_turma = campoTurma.value;

    mensagem.textContent = "";
    mensagem.style.color = "";

    const erroValidacao = validarFormulario(nome, data_peca, id_turma);

    if (erroValidacao) {
        mensagem.textContent = erroValidacao;
        mensagem.style.color = "red";
        return;
    }

    try {
        const resposta = await fetch(`${API}/pecas`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome,
                data_peca,
                id_turma
            })
        });

        const resultado = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || "Erro ao cadastrar peça.");
        }

        mensagem.textContent = resultado.mensagem || "Peça cadastrada com sucesso!";
        mensagem.style.color = "green";

        formulario.reset();
        await carregarPecas();
        await carregarTurmasInscritas();

    } catch (erro) {
        console.error(erro);

        mensagem.textContent = erro.message;
        mensagem.style.color = "red";
    }
});

// =====================================
// 6. INICIALIZAR PÁGINA
// =====================================

carregarTurmasInscritas();
carregarPecas();
