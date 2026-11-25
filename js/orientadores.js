
const formulario = document.getElementById("orientadorForm");
const campoTurma = document.getElementById("turma");
const mensagem = document.getElementById("mensagem");
const tabela = document.getElementById("orientadoresTable");

const API = "http://localhost:3000/api";

// =====================================
// 1. CARREGAR TURMAS
// =====================================

async function carregarTurmas() {

    try {
        const resposta = await fetch(`${API}/turmas`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar turmas.");
        }

        const turmas = await resposta.json();

        campoTurma.innerHTML =
            '<option value="">Selecione uma turma</option>';

        turmas.forEach(turma => {

            const opcao = document.createElement("option");

            opcao.value = turma.id_turma;
            opcao.textContent =
                `${turma.identificacao} - ${turma.curso}`;

            campoTurma.appendChild(opcao);
        });

    } catch (erro) {
        console.error(erro);

        campoTurma.innerHTML =
            '<option value="">Erro ao carregar turmas</option>';
    }
}


// =====================================
// 2. LISTAR ORIENTADORES
// =====================================

async function carregarOrientadores() {

    try {
        const resposta = await fetch(`${API}/orientadores`);

        if (!resposta.ok) {
            throw new Error("Erro ao buscar orientadores.");
        }

        const orientadores = await resposta.json();

        tabela.innerHTML = "";

        if (orientadores.length === 0) {

            tabela.innerHTML = `
                <tr>
                    <td colspan="3">
                        Nenhum orientador cadastrado.
                    </td>
                </tr>
            `;

            return;
        }

        orientadores.forEach(orientador => {

            const linha = document.createElement("tr");

            const nome = document.createElement("td");
            nome.textContent = orientador.nome;

            const curso = document.createElement("td");
            curso.textContent = orientador.curso;

            const turma = document.createElement("td");
            turma.textContent = orientador.turma;

            linha.appendChild(nome);
            linha.appendChild(curso);
            linha.appendChild(turma);

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error(erro);

        tabela.innerHTML = `
            <tr>
                <td colspan="3">
                    Erro ao carregar orientadores.
                </td>
            </tr>
        `;
    }
}


// =====================================
// 3. CADASTRAR ORIENTADOR
// =====================================

formulario.addEventListener("submit", async (evento) => {

    evento.preventDefault();

    const nome = document.getElementById("nome").value;
    const id_turma = campoTurma.value;

    try {
        const resposta = await fetch(`${API}/orientadores`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                nome,
                id_turma
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem);
        }

        mensagem.textContent = resultado.mensagem;

        formulario.reset();

        // Atualizar a tabela após o cadastro
        await carregarOrientadores();

    } catch (erro) {
        mensagem.textContent = erro.message;
    }
});


// =====================================
// 4. INICIALIZAR PÁGINA
// =====================================

carregarTurmas();
carregarOrientadores();
