async function cadastrarPet() {
    const nome = document.getElementById('nome').value;
    const tipo = document.getElementById('tipo').value;
    const idade = document.getElementById('idade').value;
    const raça  = document.getElementById('raça').value;
  
    await fetch('/cadastrar-Pet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome,tipo,idade,raça })
    });
  
    alert('Animal cadastrado com sucesso!');
  }
  
  async function cadastrarPet() {
    const nome = document.getElementById('nome').value;
    const tipo = document.getElementById('tipo').value;
    const idade = document.getElementById('idade').value;
    const raça  = document.getElementById('raça').value;

      const queryParams = new URLSearchParams();
      if (nome) queryParams.append('nome', nome);
      if (tipo) queryParams.append('tipo', tipo);
      if (idade) queryParams.append('idade', idade);
      if (raça) queryParams.append('raça', raça);
      
      const response = await fetch(`/consultar-Pet?${queryParams.toString()}`);
  
      if (!response.ok) {
          console.error('Erro ao consultar Pet:', response.statusText);
          return;
      }
  
      const Pet = await response.json();
      console.log('Pet retornados:', Pet); 
      const tabelaResultados = document.getElementById('resultadoConsulta');
      const tbody = tabelaResultados.querySelector('tbody');
      tbody.innerHTML = ''; 
  
      if (Pet.length > 0) {
          tabelaResultados.style.display = 'table';
          Pet.forEach(Pet => {
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${Pet.cgm}</td>
                  <td>${Pet.nome}</td>
                  <td>${Pet.materia || '-'}</td>
                  <td>${Pet.nota || '-'}</td>
              `;
              tbody.appendChild(row);
          });
        alert("ok");
      } else {
          tabelaResultados.style.display = 'none';
          alert('Nenhum animal encontrado com os critérios informados.');
      }
  }
  
  async function buscarPet() {
    const buscarPet = document.getElementById('buscaPet').value;
  
    if (buscarPet === '') return;
  
    const response = await fetch(`/buscar-pet?query=${buscarPet}`);
  
    if (response.ok) {
        const pet = await response.json();
  
        const petSelecionado = document.getElementById('petSelecionado');
        petSelecionado.innerHTML = '<option value="">Selecione um animal</option>';
  
        Pet.forEach(Pet => {
            const option = document.createElement('option');
            option.value = Pet.nome_cliente;
            option.textContent = `${Pet.nome} (Tipo: ${Pet.tipo})`;
            petSelecionado.appendChild(option);
        });
  
    } else {
        alert('Erro ao buscar animais. Tente novamente.');
    }
  }
  
  async function cadastrarCliente() {
    const nome = document.getElementById('clienteSelecionado').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const data_nascimento = document.getElementById('datanascimento').value;
    const nome_do_animal = document.getElementById('nomeanimal').value;
    if (!nome) {
        alert('Por favor, selecione um cliente.');
        return;
    }
    await fetch('/cadastrar-cliente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome,email,telefone,data_nascimento,nome_do_animal })
    });
    alert('Ciente cadastrado com sucesso!');
  }

  async function cadastrarProntuario() {
    const nome_cliente = document.getElementById('clienteSelecionado').value;
    const nome_do_animal = document.getElementById('nomeanimal').value;
    const data_nascimento_animal = document.getElementById('datanascimentoanimal').value;
    const especie_animal = document.getElementById('epecieanimal').value;
    const porte_animal = document.getElementById('porteanimal').value;
    const raça_animal = document.getElementById('racaanimal').value;
    const peso_animal = document.getElementById('pesoanimal').value;
    const alergias_animal = document.getElementById('alergiasanimal').value;
    const vacinas_animal= document.getElementById('vacinaanimal').value;
    const historico_medico = document.getElementById('historicomedanimal').value;
    const diagnostico_animal= document.getElementById('diagnosticoanimal').value;
    const tratamento_animal = document.getElementById('tratamentoanimal').value;
  
    await fetch('/cadastrar-prontuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_cliente,nome_do_animal,data_nascimento_animal,especie_animal,porte_animal,raça_animal,peso_animal,alergias_animal,vacinas_animal,historico_medico,diagnostico_animal,tratamento_animal})
    });
    alert('Prontuario cadastrado com sucesso!');
  }
  
  async function cadastrarTabelaserviços() {
    const tipo_de_serviço = document.getElementById('serviçoSelecionado').value;
    if (!serviço) {
        alert('Por favor, selecione um tipo de serviço.');
        return;
    }
    await fetch('/cadastrar-tabelaserviço', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo_de_serviço })
    });
    alert('Serviço cadastrado com sucesso!');
  }


  async function cadastrarAgenda() {
    const nome_cliente = document.getElementById('clienteSelecionado').value;
    const nome_do_animal = document.getElementById('nomeanimal').value;
    const telefone = document.getElementById('telefone').value;
    const data_consulta = document.getElementById('dataconsulta').value;
    const tipo_de_serviço = document.getElementById('erviçoanimal').value;
    if (!serviço) {
        alert('Por favor, selecione um tipo de serviço.');
        return;
    }
    await fetch('/cadastrar-agenda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome_cliente,nome_do_animal,telefone,data_consulta,tipo_de_serviço })
    });
    alert('Agenda cadastrada com sucesso!');
  }
 