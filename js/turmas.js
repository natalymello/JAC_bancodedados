
// =====================================
// 1. ELEMENTOS HTML
// =====================================

const API = "http://localhost:3000/api/inscricoes";

const totalTurmas = document.querySelector("#totalTurmas");
const turmaForm = document.querySelector("#turmaForm");
const turmaDisponivel = document.querySelector("#turmaDisponivel");
const turmasTable = document.querySelector("#turmasTable");

const turmaModal = document.querySelector("#turmaModal");
const mensagemTurma = document.querySelector("#mensagemTurma");

const botoesAbrirModal = document.querySelectorAll("[data-open-modal]");
const botaoFecharModal = document.querySelector("#closeModal");
const botaoCancelar = document.querySelector("#cancelModal");


// =====================================
// 2. CARREGAR TURMAS INSCRITAS
// =====================================

async function carregarTurmas() {

    try {

        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar as turmas.");
        }

        const turmas = await resposta.json();

        renderizarTurmas(turmas);

    } catch (erro) {

        console.error(erro);

        turmasTable.innerHTML = `
            <tr>
                <td colspan="3">Erro ao carregar turmas.</td>
            </tr>
        `;

    }

}


// =====================================
// 3. MOSTRAR TURMAS NA TABELA
// =====================================

function renderizarTurmas(turmas) {

    turmasTable.innerHTML = "";

    totalTurmas.textContent = turmas.length;

    if (turmas.length === 0) {

        turmasTable.innerHTML = `
            <tr>
                <td colspan="3">Nenhuma turma inscrita na JAC.</td>
            </tr>
        `;

        return;

    }

    turmas.forEach(function(turma) {

        const linha = document.createElement("tr");

        const colunaTurma = document.createElement("td");
        colunaTurma.textContent = turma.identificacao;

        const colunaCurso = document.createElement("td");
        colunaCurso.textContent = turma.curso;

        const colunaAcoes = document.createElement("td");

        const botaoRemover = document.createElement("button");

        botaoRemover.textContent = "Remover inscrição";
        botaoRemover.classList.add("btn-delete");

        botaoRemover.addEventListener("click", function() {
            excluirTurma(turma.id_turma);
        });

        colunaAcoes.appendChild(botaoRemover);

        linha.appendChild(colunaTurma);
        linha.appendChild(colunaCurso);
        linha.appendChild(colunaAcoes);

        turmasTable.appendChild(linha);

    });

}


// =====================================
// 4. CARREGAR TURMAS DISPONÍVEIS
// =====================================

async function carregarTurmasDisponiveis() {

    turmaDisponivel.innerHTML = `
        <option value="">Carregando turmas...</option>
    `;

    turmaDisponivel.disabled = true;

    try {

        const resposta = await fetch(`${API}/disponiveis`);

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar as turmas disponíveis.");
        }

        const turmas = await resposta.json();

        turmaDisponivel.innerHTML = `
            <option value="">Selecione uma turma</option>
        `;

        if (turmas.length === 0) {

            turmaDisponivel.innerHTML = `
                <option value="">Todas as turmas já estão inscritas</option>
            `;

            return;

        }

        turmas.forEach(function(turma) {

            const opcao = document.createElement("option");

            opcao.value = turma.id_turma;
            opcao.textContent = `${turma.identificacao} - ${turma.curso}`;

            turmaDisponivel.appendChild(opcao);

        });

        turmaDisponivel.disabled = false;

    } catch (erro) {

        console.error(erro);

        turmaDisponivel.innerHTML = `
            <option value="">Erro ao carregar turmas</option>
        `;

    }

}


// =====================================
// 5. ABRIR MODAL
// =====================================

botoesAbrirModal.forEach(function(botao) {

    botao.addEventListener("click", function() {

        turmaModal.hidden = false;

        mensagemTurma.textContent = "";

        carregarTurmasDisponiveis();

    });

});


// =====================================
// 6. FECHAR MODAL
// =====================================

function fecharModal() {

    turmaModal.hidden = true;

    turmaForm.reset();

    mensagemTurma.textContent = "";

}

botaoFecharModal.addEventListener("click", fecharModal);

botaoCancelar.addEventListener("click", fecharModal);


// =====================================
// 7. INSCREVER NOVA TURMA
// =====================================

turmaForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const id_turma = turmaDisponivel.value;

    if (!id_turma) {

        mensagemTurma.textContent = "Selecione uma turma.";
        return;

    }

    try {

        const resposta = await fetch(API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id_turma: id_turma
            })

        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || "Erro ao inscrever turma.");
        }

        alert(resultado.mensagem);

        fecharModal();

        carregarTurmas();

    } catch (erro) {

        console.error(erro);

        mensagemTurma.textContent = erro.message;

    }

});


// =====================================
// 8. REMOVER INSCRIÇÃO
// =====================================

async function excluirTurma(id) {

    const confirmar = confirm(
        "Deseja realmente remover a inscrição desta turma na JAC?"
    );

    if (!confirmar) return;

    try {

        const resposta = await fetch(`${API}/${id}`, {
            method: "DELETE"
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem || "Erro ao remover inscrição.");
        }

        alert(resultado.mensagem);

        carregarTurmas();

    } catch (erro) {

        console.error(erro);

        alert(erro.message);

    }

}


// =====================================
// 9. INICIALIZAÇÃO
// =====================================

carregarTurmas();
