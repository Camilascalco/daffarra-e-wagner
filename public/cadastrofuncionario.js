// Função para cadastrar um funcionário
async function cadastrarFuncionario() {
    const nome = document.getElementById('nome-funcionario').value;
    const cpf = document.getElementById('cpf-funcionario').value;
    const telefone = document.getElementById('telefone-funcionario').value;
    const email = document.getElementById('email-funcionario').value;
    const dataNascimento = document.getElementById('data-nascimento-funcionario').value;
    const dataAdmissao = document.getElementById('data-admissao-funcionario').value;
    const carteiraTrabalho = document.getElementById('carteira-trabalho-funcionario').value;
    const setor = document.getElementById('setor-funcionario').value;



    await fetch(`/cadastrar-funcionario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, cpf, telefone, email, data_nascimento: dataNascimento, data_admissao: dataAdmissao, carteira_trabalho: carteiraTrabalho, setor })
    })

}