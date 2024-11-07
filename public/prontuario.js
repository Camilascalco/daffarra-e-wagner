// Função para cadastrar um prontuário
async function cadastrarProntuario() {
    const data = document.getElementById('data-prontuario').value;
    const especieAnimal = document.getElementById('especie-prontuario').value;
    const porte = document.getElementById('porte-prontuario').value;
    const racaAnimal = document.getElementById('raca-prontuario').value;
    const pesoAnimal = document.getElementById('peso-prontuario').value;
    const alergias = document.getElementById('alergias-prontuario').value;
    const vacinas = document.getElementById('vacinas-prontuario').value;
    const historicoMedico = document.getElementById('historico-medico-prontuario').value;
    const diagnostico = document.getElementById('diagnostico-prontuario').value;
    const tratamento = document.getElementById('tratamento-prontuario').value;
    const animalId = document.getElementById('animal-id-prontuario').value;
    const funcionarioId = document.getElementById('funcionario-id-prontuario').value;


    await fetch(`/cadastrar-prontuario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, especie_animal: especieAnimal, porte, raca_animal: racaAnimal, peso_animal: pesoAnimal, alergias, vacinas, historico_medico: historicoMedico, diagnostico, tratamento, animal_id: animalId, funcionario_id: funcionarioId })
    })

}