// Função para cadastrar um animal (pet)
async function cadastrarAnimal() {
    const nome = document.getElementById('nome-animal').value;
    const especie = document.getElementById('especie-animal').value;
    const raca = document.getElementById('raca-animal').value;
    const dataNascimento = document.getElementById('data-nascimento-animal').value;
    const clienteId = document.getElementById('cliente-cpf-animal').value;


    await fetch(`/cadastrar-animal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, especie, raca, data_nascimento: dataNascimento, cliente_id: clienteId })
    })

}