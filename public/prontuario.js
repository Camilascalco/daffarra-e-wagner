// Função para cadastrar um prontuário
async function cadastrarProntuario() {
    
    const data = document.getElementById('data-prontuario').value;
    const especie_animal = document.getElementById('especie-prontuario').value;
    const porte = document.getElementById('porte-prontuario').value;
    const raca_animal = document.getElementById('raca-prontuario').value;
    const peso_animal = document.getElementById('peso-prontuario').value;
    const alergias = document.getElementById('alergias-prontuario').value;
    const vacinas = document.getElementById('vacinas-prontuario').value;
    const historico_medico = document.getElementById('historico-medico-prontuario').value;
    const diagnostico = document.getElementById('diagnostico-prontuario').value;
    const tratamento = document.getElementById('tratamento-prontuario').value;
    const animal_id = document.getElementById('animal-id-consulta').value;
    const funcionario_cpf = document.getElementById('funcionario-cpf-prontuario').value;

    await fetch(`/cadastrar-prontuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, especie_animal, porte, raca_animal, peso_animal,
             alergias, vacinas, historico_medico, diagnostico, tratamento, animal_id, funcionario_cpf })
    })
    alert('Cadastrado!');
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


    // Função para consultar prontuarios
function consultarProntuario(event) {
    event.preventDefault();
    
    const data = document.getElementById('data-prontuario').value;
    const especie_animal = document.getElementById('especie-prontuario').value;
    const raca_animal = document.getElementById('raca-prontuario').value;
    const animal_id = document.getElementById('animal-id-consulta').value;
    const funcionario_cpf = document.getElementById('funcionario-cpf-prontuario').value;
    document.getElementById("resultadoConsulta").innerHTML = `
    <h3>Resultados da Consulta</h3>
        <table id="tabelaprontuarios">
            <thead>
                <tr>
                    <th>id</th>
                    <th>Data</th>
                    <th>Espécie</th>
                    <th>Porte</th>
                    <th>Raça</th>
                    <th>Nome</th>
                    <th>Veterinário</th>
                    <th>Ação</th>
                </tr>
            </thead>
            <tbody>
                <!-- Resultados da consulta serão inseridos aqui pelo script -->
            </tbody>
        </table>

    `;
    const tabelaprontuarios = document.getElementById("tabelaprontuarios").querySelector("tbody");
    tabelaprontuarios.innerHTML = "";

    const params = new URLSearchParams({ data, especie_animal, raca_animal, animal_id, funcionario_cpf });

  

    fetch(`/consultar-prontuario?${params}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na consulta');
            }
            return response.json();
        })
        .then(prontuarios => {
            prontuarios.forEach(prontuario => {
                const row = tabelaprontuarios.insertRow();
                row.insertCell(0).innerText = prontuario.id;
                row.insertCell(1).innerText = prontuario.data;
                row.insertCell(2).innerText = prontuario.especie_animal;
                row.insertCell(3).innerText = prontuario.porte;
                row.insertCell(4).innerText = prontuario.raca_animal;
                row.insertCell(5).innerText = prontuario.nome_animal;
                row.insertCell(6).innerText = prontuario.nome_profissional;

                const actionsCell = row.insertCell(7);
                actionsCell.innerHTML = `
                    <button onclick="verProntuario('${prontuario.id}')">Ver</button>
                    
                `;
            });

            if (prontuarios.length === 0) {
                const row = tabelaprontuarios.insertRow();
                row.insertCell(0).colSpan = 6;
                row.cells[0].innerText = "Nenhum prontuario Prontuarios.";
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            const row = tabelaprontuarios.insertRow();
            row.insertCell(0).colSpan = 6;
            row.cells[0].innerText = "Erro ao consultar Prontuarios.";
        });
}



// Função para abrir o modal
function abrirModal() {
    document.getElementById("prontuarioModal").style.display = "block";
}

// Função para fechar o modal
function fecharModal() {
    document.getElementById("prontuarioModal").style.display = "none";
}
  
// Função para buscar o prontuário pelo ID e exibir no modal
function verProntuario(id) {
    alert(id);
    fetch(`/prontuario?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data) {
            const prontuarioInfo = `
                <strong>Nome:</strong> ${data.id} <br>
                <strong>Nome:</strong> ${data.data} <br>
                <strong>Nome:</strong> ${data.especie_animal} <br>
                <strong>Nome:</strong> ${data.porte} <br>
                <strong>Nome:</strong> ${data.raca_animal} <br>
                <strong>Nome:</strong> ${data.peso_animal} <br>
                <strong>Nome:</strong> ${data.alergias} <br>
                <strong>Nome:</strong> ${data.vacinas} <br>
                <strong>Nome:</strong> ${data.historico_medico} <br>
                <strong>Nome:</strong> ${data.diagnostico} <br>
                <strong>Nome:</strong> ${data.tratamento} <br>
                <strong>Nome:</strong> ${data.animal_id} <br>
                <strong>Nome:</strong> ${data.funcionario_cpf} <br>
            
          `;
          document.getElementById('prontuarioInfo').innerHTML = prontuarioInfo;
          abrirModal();
        } else {
          alert('Prontuário não encontrado');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar prontuário:', error);
      });
  }
  