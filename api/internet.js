import axios from 'axios';
import https from 'https';

const url = 'https://api.qedu.org.br/v1/censo/territorio?ibge_id=21&ano=2019&dependencia_id=2&ciclo_id=EM';

const options = {
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer bBM1iYsPk2sbq9iUgR1iVsHzfaq6oIVKxHNnqhhE'
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
};

axios.get(url, options)
    .then(response => {
        // 1. Mostra a estrutura completa para diagnóstico
        console.log('ESTRUTURA COMPLETA DA RESPOSTA:');
        console.log(response.data);

        // 2. Função para encontrar campos independentemente do nome exato
        const findField = (data, possibleNames) => {
            const found = possibleNames.find(name => data[name] !== undefined);
            return found ? data[found] : undefined;
        };

        const camposRequisitados = {
            tecnologia_internet: ['internet', 'acesso_internet', 'conectividade', 'rede_internet'],
            tecnologia_banda_larga: ['banda_larga', 'internet_banda_larga', 'velocidade_internet'],
            tecnologia_computadores_alunos: ['computadores_alunos', 'computadores_estudantes', 'maquinas_alunos'],
            tecnologia_computadores_administrativos: ['computadores_administrativos', 'computadores_administracao', 'pcs_administrativos'],
            matriculas_em_1ano: ['matriculas_1ano', 'matriculas_primeiro_ano', 'alunos_1ano'],
            matriculas_em_2ano: ['matriculas_2ano', 'matriculas_segundo_ano', 'alunos_2ano'],
            matriculas_em_3ano: ['matriculas_3ano', 'matriculas_terceiro_ano', 'alunos_3ano']
        };

        // 4. Construindo o resultado final
        const resultadoFinal = {};
        
        for (const [campoDesejado, nomesPossiveis] of Object.entries(camposRequisitados)) {
            const valor = findField(response.data, nomesPossiveis);
            if (valor !== undefined) {
                resultadoFinal[campoDesejado] = valor;
            }
        }

        // 5. Mostrando o resultado
        if (Object.keys(resultadoFinal).length > 0) {
            console.log('\nDADOS FILTRADOS COM SUCESSO:');
            console.log(resultadoFinal);
        } else {
            console.log('\nNENHUM DOS CAMPOS SOLICITADOS FOI ENCONTRADO NA RESPOSTA.');
            console.log('Sugestão: Verifique os nomes dos campos na estrutura completa mostrada acima.');
        }
    })
    .catch(error => {
        console.error('ERRO:', error.response?.data || error.message);
    });