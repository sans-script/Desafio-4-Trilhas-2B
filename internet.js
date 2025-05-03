import axios from 'axios';
import https from 'https';

const url = 'https://api.qedu.org.br/v1/censo/territorio'   ; // Endpoint correto
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
        // Mostrar a resposta completa para entender o formato dos dados
        console.log('Resposta da API:', response.data);

        // Organizando os dados por IBGE
        const dadosAgrupados = {};

        // Supor que a resposta seja uma lista de escolas
        const escolas = response.data || []; // Ajuste conforme o formato real dos dados

        // Inicializar contadores
        escolas.forEach((escola) => {
            const { ibge_id, tipo } = escola;

            // Verifica se o IBGE ID já foi adicionado ao agrupamento
            if (!dadosAgrupados[ibge_id]) {
                dadosAgrupados[ibge_id] = {
                    urbanasComInternet: 0,
                    ruraisComInternet: 0,
                    urbanasComBandaLarga: 0,
                    ruraisComBandaLarga: 0,
                    urbanasComComputadoresAlunos: 0,
                    ruraisComComputadoresAlunos: 0,
                    urbanasComComputadoresAdministrativos: 0,
                    ruraisComComputadoresAdministrativos: 0,
                    urbanasTotais: 0,
                    ruraisTotais: 0,
                };
            }

            const dados = dadosAgrupados[ibge_id];

            // Contando as tecnologias para cada tipo (urbana ou rural)
            if (tipo === 'urbana') {
                dados.urbanasTotais++;

                if (escola.tecnologia_internet) dados.urbanasComInternet++;
                if (escola.tecnologia_banda_larga) dados.urbanasComBandaLarga++;
                if (escola.tecnologia_computadores_alunos) dados.urbanasComComputadoresAlunos++;
                if (escola.tecnologia_computadores_administrativos) dados.urbanasComComputadoresAdministrativos++;
            } else if (tipo === 'rural') {
                dados.ruraisTotais++;

                if (escola.tecnologia_internet) dados.ruraisComInternet++;
                if (escola.tecnologia_banda_larga) dados.ruraisComBandaLarga++;
                if (escola.tecnologia_computadores_alunos) dados.ruraisComComputadoresAlunos++;
                if (escola.tecnologia_computadores_administrativos) dados.ruraisComComputadoresAdministrativos++;
            }
        });

        // Função para calcular a porcentagem
        const calcularPorcentagem = (comTecnologia, totais) => {
            return totais > 0 ? (comTecnologia / totais) * 100 : 0;
        };

        // Exibir os resultados para cada IBGE ID
        Object.keys(dadosAgrupados).forEach((ibge_id) => {
            const dados = dadosAgrupados[ibge_id];

            console.log(`\nIBGE ID: ${ibge_id}`);
            console.log(`Porcentagem de escolas urbanas com acesso à internet: ${calcularPorcentagem(dados.urbanasComInternet, dados.urbanasTotais).toFixed(2)}%`);
            console.log(`Porcentagem de escolas rurais com acesso à internet: ${calcularPorcentagem(dados.ruraisComInternet, dados.ruraisTotais).toFixed(2)}%`);
            
            console.log(`Porcentagem de escolas urbanas com banda larga: ${calcularPorcentagem(dados.urbanasComBandaLarga, dados.urbanasTotais).toFixed(2)}%`);
            console.log(`Porcentagem de escolas rurais com banda larga: ${calcularPorcentagem(dados.ruraisComBandaLarga, dados.ruraisTotais).toFixed(2)}%`);
            
            console.log(`Porcentagem de escolas urbanas com computadores para alunos: ${calcularPorcentagem(dados.urbanasComComputadoresAlunos, dados.urbanasTotais).toFixed(2)}%`);
            console.log(`Porcentagem de escolas rurais com computadores para alunos: ${calcularPorcentagem(dados.ruraisComComputadoresAlunos, dados.ruraisTotais).toFixed(2)}%`);
            
            console.log(`Porcentagem de escolas urbanas com computadores administrativos: ${calcularPorcentagem(dados.urbanasComComputadoresAdministrativos, dados.urbanasTotais).toFixed(2)}%`);
            console.log(`Porcentagem de escolas rurais com computadores administrativos: ${calcularPorcentagem(dados.ruraisComComputadoresAdministrativos, dados.ruraisTotais).toFixed(2)}%`);
        });
    })
    .catch((error) => {
        console.error('Erro na requisição:', error);
    });
