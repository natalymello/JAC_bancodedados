
// =====================================
// 1. ELEMENTOS DO PAINEL
// =====================================

const totalCursos = document.getElementById("totalCursos");
const totalTurmas = document.getElementById("totalTurmas");
const totalEstudantes = document.getElementById("totalEstudantes");
const totalPecas = document.getElementById("totalPecas");

const API = "http://localhost:3000/api";


// =====================================
// 2. CARREGAR DADOS DO BANCO
// =====================================

async function carregarPainel() {

    try {

        // Buscar todas as turmas e seus cursos
        const respostaTurmas = await fetch(`${API}/turmas`);

        // Buscar somente as turmas inscritas na JAC
        const respostaInscricoes = await fetch(`${API}/inscricoes`);

        // Buscar estudantes cadastrados
        const respostaEstudantes = await fetch(`${API}/estudantes`);

        // Buscar peças cadastradas
        const respostaPecas = await fetch(`${API}/pecas`);


        // Verificar se todas as consultas funcionaram
        if (
            !respostaTurmas.ok ||
            !respostaInscricoes.ok ||
            !respostaEstudantes.ok ||
            !respostaPecas.ok
        ) {
            throw new Error("Erro ao consultar os dados do painel.");
        }


        // Transformar as respostas em JSON
        const turmas = await respostaTurmas.json();
        const inscricoes = await respostaInscricoes.json();
        const estudantes = await respostaEstudantes.json();
        const pecas = await respostaPecas.json();


        // =====================================
        // 3. CONTAR OS REGISTROS
        // =====================================

        // Identificar cursos sem repetir
        const cursos = new Set(
            turmas.map(turma => turma.id_curso)
        );


        // Atualizar os indicadores
        totalCursos.textContent = cursos.size;

        totalTurmas.textContent = inscricoes.length;

        totalEstudantes.textContent = estudantes.length;

        totalPecas.textContent = pecas.length;


    } catch (erro) {

        console.error("Erro ao carregar painel:", erro);

    }

}


// =====================================
// 4. INICIALIZAR PAINEL
// =====================================

carregarPainel();
