import axios from 'axios';
import https from 'https';
import fs from 'fs';

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
        const dadosBrutos = response.data;
        
        // 1. Salvar dados brutos para análise
        fs.writeFileSync('dados_brutos.json', JSON.stringify(dadosBrutos, null, 2));
        console.log('✅ Dados brutos salvos em "dados_brutos.json".');

        // 2. Função para extrair TODOS os campos não nulos
        const filtrarDadosNaoNulos = (obj) => {
            const resultado = {};
            for (const [chave, valor] of Object.entries(obj)) {
                if (valor !== null && valor !== undefined) {
                    if (typeof valor === 'object' && !Array.isArray(valor)) {
                        // Se for um sub-objeto, filtra recursivamente
                        const subObjFiltrado = filtrarDadosNaoNulos(valor);
                        if (Object.keys(subObjFiltrado).length > 0) {
                            resultado[chave] = subObjFiltrado;
                        }
                    } else {
                        resultado[chave] = valor;
                    }
                }
            }
            return resultado;
        };

        // 3. Aplicar filtro
        const dadosFiltrados = filtrarDadosNaoNulos(dadosBrutos);

        // 4. Mostrar e salvar
        if (Object.keys(dadosFiltrados).length > 0) {
            console.log('🔍 Dados não nulos encontrados:');
            console.log(dadosFiltrados);
            fs.writeFileSync('dados_filtrados.json', JSON.stringify(dadosFiltrados, null, 2));
            console.log('✅ Dados filtrados salvos em "dados_filtrados.json".');
        } else {
            console.log('⚠️ A resposta da API não contém dados não nulos.');
        }
    })
    .catch(error => {
        console.error('❌ Erro:', error.response?.data || error.message);
    });