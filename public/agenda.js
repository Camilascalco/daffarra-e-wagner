// Função para cadastrar uma consulta
async function cadastrarConsulta() {
    const data = document.getElementById('data-consulta').value;
    const hora = document.getElementById('hora-consulta').value;
    const tipoConsulta = document.getElementById('tipo-consulta').value;
    const observacao = document.getElementById('observacao-consulta').value;
    const clienteId = document.getElementById('cliente-id-consulta').value;
    const animalId = document.getElementById('animal-id-consulta').value;
    const funcionarioId = document.getElementById('funcionario-id-consulta').value;


    await fetch(`/cadastrar-consulta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, hora, tipo_consulta: tipoConsulta, observacao, cliente_id: clienteId, animal_id: animalId, funcionario_id: funcionarioId })
    })

}
