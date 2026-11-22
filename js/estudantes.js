const API = "http://localhost:3000/api";

let todasAsTurmas = [];

// Carregar cursos e turmas
async function carregarTurmas() {
    try {
        const resposta = await fetch(`${API}/turmas`);
        todasAsTurmas = await resposta.json();

        const campoCurso = document.getElementById("curso");

        // Evitar cursos repetidos
        const cursos = [];

        todasAsTurmas.forEach(turma => {
            const existe = cursos.some(
                curso => curso.id_curso === turma.id_curso
            );

            if (!existe) {
                cursos.push({
                    id_curso: turma.id_curso,
                    nome: turma.curso
                });
            }
        });

        campoCurso.innerHTML =
            '<option value="">Selecione um curso</option>';

        cursos.forEach(curso => {
            const opcao = document.createElement("option");

            opcao.value = curso.id_curso;
            opcao.textContent = curso.nome;

            campoCurso.appendChild(opcao);
        });

    } catch (erro) {
        console.error("Erro ao carregar cursos:", erro);
    }
}

// Carregar turmas do curso selecionado
document.getElementById("curso").addEventListener("change", function () {
    const idCurso = Number(this.value);
    const campoTurma = document.getElementById("turma");

    campoTurma.innerHTML =
        '<option value="">Selecione uma turma</option>';

    if (!idCurso) {
        campoTurma.disabled = true;
        return;
    }

    const turmasDoCurso = todasAsTurmas.filter(
        turma => turma.id_curso === idCurso
    );

    turmasDoCurso.forEach(turma => {
        const opcao = document.createElement("option");

        opcao.value = turma.id_turma;
        opcao.textContent = turma.identificacao;

        campoTurma.appendChild(opcao);
    });

    campoTurma.disabled = false;
});

// Iniciar carregamento
carregarTurmas();
// Cadastrar estudante
const formulario = document.getElementById("estudanteForm");

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome").value;
    const matricula = document.getElementById("matricula").value;
    const id_turma = document.getElementById("turma").value;

    const mensagem = document.getElementById("mensagem");

    try {
        const resposta = await fetch(`${API}/estudantes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nome: nome,
                matricula: matricula,
                id_turma: id_turma
            })
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.mensagem);
        }

        mensagem.textContent = "Estudante cadastrado com sucesso!";
        mensagem.style.color = "green";

        formulario.reset();

        document.getElementById("turma").disabled = true;
        carregarEstudantes();

    } catch (erro) {
        mensagem.textContent = erro.message;
        mensagem.style.color = "red";
    }
});
// Listar estudantes na tabela
async function carregarEstudantes() {
    const tabela = document.getElementById("estudantesTable");

    try {
        const resposta = await fetch(`${API}/estudantes`);
        const estudantes = await resposta.json();

        tabela.innerHTML = "";

        if (estudantes.length === 0) {
            tabela.innerHTML = `
                <tr>
                    <td colspan="4">Nenhum estudante cadastrado.</td>
                </tr>
            `;
            return;
        }

        estudantes.forEach(estudante => {
            const linha = document.createElement("tr");

            const nome = document.createElement("td");
            nome.textContent = estudante.nome;

            const matricula = document.createElement("td");
            matricula.textContent = estudante.matricula;

            const turma = document.createElement("td");
            turma.textContent = estudante.turma;

            const curso = document.createElement("td");
            curso.textContent = estudante.curso;

            linha.appendChild(nome);
            linha.appendChild(matricula);
            linha.appendChild(turma);
            linha.appendChild(curso);

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error("Erro ao carregar estudantes:", erro);
        tabela.innerHTML = `
            <tr>
                <td colspan="4">Erro ao carregar estudantes.</td>
            </tr>
        `;
    }
}
carregarEstudantes();