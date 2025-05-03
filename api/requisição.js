import axios from 'axios';
import https from 'https';

const url =
    'https://api.qedu.org.br/v1/ideb?id=2111300&ano=2019&dependencia_id=2&ciclo_id=EM';
const options = {
    headers: {
        Accept: 'application/json',
        Authorization: 'Bearer 0eCq1hevDWEewFwL3eFjcAaCtBQw1VGURgRTlQHb',
    },
    httpsAgent: new https.Agent({
        rejectUnauthorized: false, // Ignora a validação SSL
    }),
};

axios
    .get(url, options)
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.error('Erro na requisição:', error);
    });
