import axios from 'axios';
import https from 'https';

const url = 'https://api.qedu.org.br/v1/escolas?estado_id=21&ano=2019';
const options = { 
  headers: {
    Accept: 'application/json',
    Authorization: 'Bearer iYnB1spKXMnwYCN7wPZ4KoQjeqGuzHRQTiEHL8ej',
  },
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
};
function analisarEscolas(escolas) {
  if (!escolas || escolas.length === 0) {
    console.log('Nenhuma escola encontrada!');
    return;
  }
  const totalEscolas = escolas.length;
  console.log(`Total de escolas encontradas: ${totalEscolas}`);
  const escolasUrbanas = escolas.filter(escola => escola.localizacao === 'Urbana');
  const escolasRurais = escolas.filter(escola => escola.localizacao === 'Rural');

  const percentualUrbanas = ((escolasUrbanas.length / totalEscolas) * 100).toFixed(2);
  const percentualRurais = ((escolasRurais.length / totalEscolas) * 100).toFixed(2);

  console.log(`\nDistribuição por localização:`);
  console.log(`- Urbanas: ${escolasUrbanas.length} (${percentualUrbanas}%)`);
  console.log(`- Rurais: ${escolasRurais.length} (${percentualRurais}%)`);
}
axios.get(url, options)
  .then(response => {
    console.log('=== DADOS DA API ===');
    if (response.data && response.data.data) {
      analisarEscolas(response.data.data);
    } else {
      console.log('Estrutura de dados diferente do esperado:', response.data);
    }
  })
  .catch(error => {
    console.error('\n=== ERRO NA REQUISIÇÃO ===');
    if (error.response) {
      // Erro retornado pela API
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.log('Sem resposta do servidor:', error.request);
    } else {
      // Outros erros
      console.log('Erro:', error.message);
    }
  });