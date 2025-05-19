import axios from 'axios';
import https from 'https';

// Parâmetros da consulta
const id = 2111300;        // Código IBGE do município
const ano = 2019;          // Ano obrigatório
const ciclo_id = 'EM';     // Ensino Médio
const serie_id = 10;       // 10 = 1º ano do EM (série_id: 10 a 13 para EM)

// URL com os parâmetros formatados
const url = `https://api.qedu.org.br/v1/ideb/aprovacoes?id=${id}&ano=${ano}&ciclo_id=${ciclo_id}&serie_id=${serie_id}`;

const options = {
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer iYnB1spKXMnwYCN7wPZ4KoQjeqGuzHRQTiEHL8ej',
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Ignora validação SSL (não recomendado em produção)
    }),
};

axios
    .get(url, options)
    .then((response) => {
        console.log('Dados de aprovação (1º ano EM):');
        console.log(response.data);
    })
    .catch((error) => {
        console.error('Erro na requisição:', error);
    });