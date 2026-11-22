
// =====================================
// 1. ELEMENTOS DO MODAL
// =====================================

const openModal = document.querySelector("#openModal");
const closeModal = document.querySelector("#closeModal");
const cancelModal = document.querySelector("#cancelModal");
const turmaModal = document.querySelector("#turmaModal");


// =====================================
// 2. ABRIR MODAL
// =====================================

openModal.addEventListener("click", function() {

    turmaModal.hidden = false;

});


// =====================================
// 3. FECHAR MODAL
// =====================================

function fecharModal() {

    turmaModal.hidden = true;

}


// Botão X
closeModal.addEventListener("click", fecharModal);


// Botão Cancelar
cancelModal.addEventListener("click", fecharModal);


// Fechar clicando fora da caixa
turmaModal.addEventListener("click", function(event) {

    if (event.target === turmaModal) {
        fecharModal();
    }

});
