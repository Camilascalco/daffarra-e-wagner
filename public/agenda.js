// Função para cadastrar uma consulta
async function cadastrarConsulta() {
    
    const data = document.getElementById('data-consulta').value;
    const hora = document.getElementById('hora-consulta').value;
    const tipo_consulta = document.getElementById('tipo-consulta').value;
    const observacao = document.getElementById('observacao-consulta').value;
    const cliente_cpf = document.getElementById('cliente-cpf-consulta').value;
    const animal_id = document.getElementById('animal-id-consulta').value;
    const funcionario_cpf = document.getElementById('funcionario-cpf-consulta').value;

    await fetch(`/cadastrar-consulta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, hora, tipo_consulta, observacao, cliente_cpf, animal_id, funcionario_cpf })
    })

}
async function buscarpet() {

    const buscaPet = document.getElementById('cliente-cpf-consulta').value;
  
    // Se o campo de busca estiver vazio, não faz nada
    if (buscaPet === '') return;
  
    // Faz a busca no servidor
    const response = await fetch(`/buscar-pet?query=${buscaPet}`);
  
    // Verifica se a resposta foi bem-sucedida
    if (response.ok) {
        const animais = await response.json();
  
        // Seleciona o dropdown de pets
        const petSelecionado = document.getElementById('animal-id-consulta');
        petSelecionado.innerHTML = '<option value="">Selecione um pet</option>';
  
        // Preenche o dropdown com os resultados da busca
        animais.forEach(pet => {
            const option = document.createElement('option');
            option.value = pet.id;
            option.textContent = `${pet.nome} (ID: ${pet.id})`;
            petSelecionado.appendChild(option);
        });
  
    } else {
        alert('Erro ao buscar pets. Tente novamente.');
    }
  }

  // Função para consultar agendamentos
function consultarAgendamentos(event) {
    event.preventDefault();

    const data = document.getElementById('data-consulta').value;
    const tipo_consulta = document.getElementById('tipo-consulta').value;
    const observacao = document.getElementById('observacao-consulta').value;
    const cliente_cpf = document.getElementById('cliente-cpf-consulta').value;
    const animal_id = document.getElementById('animal-id-consulta').value;
    const funcionario_cpf = document.getElementById('funcionario-cpf-consulta').value;
    document.getElementById("resultadoConsulta").innerHTML = `
    <div id="tabelaprontuarios"  class="tabela-prontuarios">
        <button class="sair" onclick="fecharResultadoConsulta()">X</button>
        <h3>Resultados da Consulta</h3>
        <table id="tabelaAgendamento>
            <thead>
                <tr>
                    <th>id</th>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Animal</th>
                    <th>Cliente</th>
                    <th>Profissional</th>
                    <th>Consulta</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <!-- Resultados da consulta serão inseridos aqui pelo script -->
            </tbody>
        </table>
    </div>
    `;
    const tabelaAgendamentos = document.getElementById("tabelaAgendamentos").querySelector("tbody");
    tabelaAgendamentos.innerHTML = "";

    const params = new URLSearchParams({ data, tipo_consulta, observacao, cliente_cpf, animal_id, funcionario_cpf });

  

    fetch(`/consultar-agendamentos?${params}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na consulta');
            }
            return response.json();
        })
        .then(agendamentos => {
            agendamentos.forEach(agendamento => {
                const row = tabelaAgendamentos.insertRow();
                row.insertCell(0).innerText = agendamento.id;
                row.insertCell(1).innerText = agendamento.data;
                row.insertCell(2).innerText = agendamento.hora;
                row.insertCell(3).innerText = agendamento.nome_animal;
                row.insertCell(4).innerText = agendamento.nome_cliente;
                row.insertCell(5).innerText = agendamento.nome_profissional;
                row.insertCell(6).innerText = agendamento.tipo_consulta;
                

                const actionsCell = row.insertCell(7);
                actionsCell.innerHTML = `
                    <button onclick="excluirAgendamento('${agendamento.id}')">Excluir</button>
                    
                `;
            });

            if (agendamentos.length === 0) {
                const row = tabelaAgendamentos.insertRow();
                row.insertCell(0).colSpan = 6;
                row.cells[0].innerText = "Nenhum agendamento encontrado.";
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            const row = tabelaAgendamentos.insertRow();
            row.insertCell(0).colSpan = 6;
            row.cells[0].innerText = "Erro ao consultar agendamentos.";
        });
}

// Função para excluir agendamento
async function excluirAgendamento(id) {
    try {
        const response = await fetch(`/excluir-agendamento?id=${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir agendamento');
        alert('Agendamento excluído com sucesso!');
        consultarAgendamentos(new Event('submit')); // Atualiza a lista após exclusão
    } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
        alert('Erro ao excluir agendamento');
    }
}