// Função para cadastrar um cliente (tutor)
async function cadastrarCliente() {
    const nome = document.getElementById('nome-cliente').value;
    const cpf = document.getElementById('cpf-cliente').value;
    const telefone = document.getElementById('telefone-cliente').value;
    const email = document.getElementById('email-cliente').value;
    const endereco = document.getElementById('endereco-cliente').value;

    await fetch(`/cadastrar-cliente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, telefone, email, endereco })
    })

}