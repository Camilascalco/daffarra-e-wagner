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
  
  async function consultar() {
      const nome = document.getElementById('nome').value;
      const cgm = document.getElementById('cgm').value;
      const materia = document.getElementById('materia').value;
      const notaMin = document.getElementById('notaMin').value;
      const notaMax = document.getElementById('notaMax').value;
  
      const queryParams = new URLSearchParams();
      if (nome) queryParams.append('nome', nome);
      if (cgm) queryParams.append('cgm', cgm);
      if (materia) queryParams.append('materia', materia);
      if (notaMin) queryParams.append('notaMin', notaMin);
      if (notaMax) queryParams.append('notaMax', notaMax);
  
      // Faz a requisição para a rota de consulta
      const response = await fetch(`/consultar-alunos?${queryParams.toString()}`);
  
      // Verifica se a resposta foi bem sucedida
      if (!response.ok) {
          console.error('Erro ao consultar alunos:', response.statusText);
          return;
      }
  
      const alunos = await response.json();
      console.log('Alunos retornados:', alunos); // Adiciona log para verificar dados retornados
      const tabelaResultados = document.getElementById('resultadoConsulta');
      const tbody = tabelaResultados.querySelector('tbody');
      tbody.innerHTML = ''; // Limpa a tabela antes de adicionar resultados
  
      if (alunos.length > 0) {
          tabelaResultados.style.display = 'table';
          alunos.forEach(aluno => {
              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${aluno.cgm}</td>
                  <td>${aluno.nome}</td>
                  <td>${aluno.materia || '-'}</td>
                  <td>${aluno.nota || '-'}</td>
              `;
              tbody.appendChild(row);
          });
        alert("ok");
      } else {
          tabelaResultados.style.display = 'none';
          alert('Nenhum aluno encontrado com os critérios informados.');
      }
  }
  
  async function buscarAluno() {
    const buscaAluno = document.getElementById('buscaAluno').value;
  
    // Se o campo de busca estiver vazio, não faz nada
    if (buscaAluno === '') return;
  
    // Faz a busca no servidor
    const response = await fetch(`/buscar-aluno?query=${buscaAluno}`);
  
    // Verifica se a resposta foi bem-sucedida
    if (response.ok) {
        const alunos = await response.json();
  
        // Seleciona o dropdown de alunos
        const alunoSelecionado = document.getElementById('alunoSelecionado');
        alunoSelecionado.innerHTML = '<option value="">Selecione um aluno</option>';
  
        // Preenche o dropdown com os resultados da busca
        alunos.forEach(aluno => {
            const option = document.createElement('option');
            option.value = aluno.cgm;
            option.textContent = `${aluno.nome} (CGM: ${aluno.cgm})`;
            alunoSelecionado.appendChild(option);
        });
  
    } else {
        alert('Erro ao buscar alunos. Tente novamente.');
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
 