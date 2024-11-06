document.getElementById('animalForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const tipo = document.getElementById('tipo').value;
    const idade = document.getElementById('idade').value;
    const raca = document.getElementById('raca').value;

    if (!nome || !tipo || !idade || !raca) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const mensagem = 'Animal cadastrado:\nNome: ${nome}\nTipo: ${tipo}\nIdade: ${idade} anos\nRaça: ${raca}';
    
    const mensagemDiv = document.getElementById('mensagem');
    mensagemDiv.innerText = mensagem;
    mensagemDiv.style.opacity = 1;

    // Limpar o formulário
    this.reset();
    
    // Ocultar a mensagem após 5 segundos
    setTimeout(() => {
        mensagemDiv.style.opacity = 0;
    }, 5000);
});