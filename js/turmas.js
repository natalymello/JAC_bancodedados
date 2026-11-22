
// =====================================
// 1. ELEMENTOS HTML
// =====================================
const totalTurmas = document.querySelector("#totalTurmas");

const turmaForm = document.querySelector("#turmaForm");

const periodoInput = document.querySelector("#periodo");

const cursoInput = document.querySelector("#curso");

const turmasTable = document.querySelector("#turmasTable");


// =====================================
// 2. ARMAZENAMENTO
// =====================================

let turmas = JSON.parse(
    localStorage.getItem("jac_turmas")
) || [];


// =====================================
// 3. SALVAR DADOS
// =====================================

function salvarTurmas() {

    localStorage.setItem(
        "jac_turmas",
        JSON.stringify(turmas)
    );

}


// =====================================
// 4. EXIBIR TURMAS
// =====================================

function renderizarTurmas() {

    turmasTable.innerHTML = "";
    totalTurmas.textContent = turmas.length;

    if (turmas.length === 0) {

        const linha = document.createElement("tr");
        const coluna = document.createElement("td");

        coluna.colSpan = 3;
        coluna.textContent = "Nenhuma turma cadastrada.";

        linha.appendChild(coluna);
        turmasTable.appendChild(linha);

        return;
    }

    turmas.forEach(function(turma) {

        const linha = document.createElement("tr");

        // Identificação
        const colunaIdentificacao = document.createElement("td");
        colunaIdentificacao.textContent = turma.identificacao;

        // Curso
        const colunaCurso = document.createElement("td");
        colunaCurso.textContent = turma.curso;

        // Ações
        const colunaAcoes = document.createElement("td");

        const botaoExcluir = document.createElement("button");

        botaoExcluir.textContent = "Excluir";
        botaoExcluir.classList.add("btn-delete");

        botaoExcluir.addEventListener("click", function() {
            excluirTurma(turma.id);
        });

        colunaAcoes.appendChild(botaoExcluir);

        // Montando a linha
        linha.appendChild(colunaIdentificacao);
        linha.appendChild(colunaCurso);
        linha.appendChild(colunaAcoes);

        turmasTable.appendChild(linha);

    });

}


// =====================================
// 5. CADASTRAR TURMA
// =====================================

turmaForm.addEventListener("submit", function(event) {

    event.preventDefault();

    // Capturando os valores
    const periodo = periodoInput.value.trim().toUpperCase();

    const curso = cursoInput.value;

    // Validando os campos
    if (!periodo || !curso) {

        alert("Preencha todos os campos!");

        return;

    }

    // Montando a identificação automaticamente
    const identificacao = `${curso} ${periodo}`;

    // Criando o objeto da turma
    const novaTurma = {

        id: Date.now(),

        identificacao: identificacao,

        curso: curso

    };

    // Adicionando à lista
    turmas.push(novaTurma);

    // Salvando os dados
    salvarTurmas();

    // Atualizando a tabela
    renderizarTurmas();

    // Limpando o formulário
    turmaForm.reset();

    // Fechando o modal
    turmaModal.hidden = true;

    alert("Turma cadastrada com sucesso!");

});


// =====================================
// 6. EXCLUIR TURMA
// =====================================

function excluirTurma(id) {

    const confirmar = confirm(
        "Deseja realmente excluir esta turma?"
    );

    if (!confirmar) {
        return;
    }

    turmas = turmas.filter(function(turma) {

        return turma.id !== id;

    });

    salvarTurmas();

    renderizarTurmas();

}


// =====================================
// 7. INICIALIZAÇÃO
// =====================================

renderizarTurmas();
