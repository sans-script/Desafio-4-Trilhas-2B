import axios from 'axios';
import https from 'https';

const url = 'https://api.qedu.org.br/v1/escolas?estado_id=21'; // Buscando escolas no Maranhão (estado_id 21)
const options = {
  headers: {
    Accept: 'application/json',
    Authorization: 'Bearer AbWZ6hS1XvIUszLyiM5k6iTykA32OgybsDpqBmor',
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false, // Ignora a validação SSL
  }),
};

axios
  .get(url, options)
  .then((response) => {
    const escolas = response.data.data; // Acesse o array correto de escolas
    if (!escolas || escolas.length === 0) {
      console.log('Nenhuma escola encontrada!');
      return;
    }

    const totalEscolas = escolas.length;
    const escolasUrbanas = escolas.filter((escola) => escola.localizacao === 'Urbana').length;
    const escolasRurais = escolas.filter((escola) => escola.localizacao === 'Rural').length;

    const percentualUrbanas = ((escolasUrbanas / totalEscolas) * 100).toFixed(2);
    const percentualRurais = ((escolasRurais / totalEscolas) * 100).toFixed(2);

    // Exibe apenas os percentuais
    console.log("Percentual de escolas urbanas no Maranhão:" ${percentualUrbanas},"%");
    console.log("Percentual de escolas rurais no Maranhão:" ${percentualRurais},"%");
  })
  .catch((error) => {
    console.error('Erro na requisição:', error);
  });
