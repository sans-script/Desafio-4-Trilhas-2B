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

async function calculateComputerPercentages() {
    try {
        console.log('🔄 Fazendo requisição para a API...');
        const response = await axios.get(url, options);
        const responseData = response.data;
        
        console.log('✅ Dados recebidos com sucesso!\n');
        
        if (!responseData.data || !Array.isArray(responseData.data)) {
            console.log('⚠️ Estrutura de dados inesperada. Não foi possível encontrar um array de dados.');
            return;
        }
        
        // Estrutura para armazenar os resultados
        const results = {
            rural: { 
                totalStudents: 0,
                adminComputers: 0,
                studentComputers: 0,
                totalComputers: 0
            },
            urban: {
                totalStudents: 0,
                adminComputers: 0,
                studentComputers: 0,
                totalComputers: 0
            },
            total: {
                totalStudents: 0,
                adminComputers: 0,
                studentComputers: 0,
                totalComputers: 0
            }
        };
        
        // Contador para saber quantos registros processamos
        let processedCount = 0;
        let ruralCount = 0;
        let urbanCount = 0;
        
        // Processar cada registro no array de dados
        for (const item of responseData.data) {
            // Verificar se o registro tem os campos que precisamos
            if (item.hasOwnProperty('tecnologia_computadores_alunos') && 
                item.hasOwnProperty('tecnologia_computadores_administrativos')) {
                
                processedCount++;
                
                // Determinar se é rural ou urbano
                // Vamos verificar se há algum campo que indique a localização
                let locationType = 'unknown';
                
                if (item.hasOwnProperty('localizacao')) {
                    locationType = item.localizacao.toLowerCase() === 'rural' ? 'rural' : 'urban';
                } else if (item.hasOwnProperty('tipo_localizacao')) {
                    locationType = item.tipo_localizacao.toLowerCase() === 'rural' ? 'rural' : 'urban';
                } else if (item.hasOwnProperty('zona')) {
                    locationType = item.zona.toLowerCase() === 'rural' ? 'rural' : 'urban';
                } else {
                    // Se não conseguirmos identificar, vamos considerar como urbano (mais comum)
                    locationType = 'urban';
                }
                
                // Contar quantos de cada tipo
                if (locationType === 'rural') ruralCount++;
                else if (locationType === 'urban') urbanCount++;
                
                // Adicionar computadores administrativos
                const adminComputers = Number(item.tecnologia_computadores_administrativos) || 0;
                results[locationType].adminComputers += adminComputers;
                results.total.adminComputers += adminComputers;
                
                // Adicionar computadores para alunos
                const studentComputers = Number(item.tecnologia_computadores_alunos) || 0;
                results[locationType].studentComputers += studentComputers;
                results.total.studentComputers += studentComputers;
                
                // Calcular total de computadores
                results[locationType].totalComputers += (adminComputers + studentComputers);
                results.total.totalComputers += (adminComputers + studentComputers);
                
                // Adicionar número de alunos (se disponível)
                if (item.hasOwnProperty('matriculas') || item.hasOwnProperty('alunos_total') || item.hasOwnProperty('total_alunos')) {
                    const students = Number(item.matriculas || item.alunos_total || item.total_alunos) || 0;
                    results[locationType].totalStudents += students;
                    results.total.totalStudents += students;
                }
            }
        }
        
        // Se não encontramos o número de alunos, vamos usar uma estimativa para fins de cálculo
        // (ajuste este valor conforme necessário)
        if (results.total.totalStudents === 0) {
            console.log('⚠️ Não foi possível encontrar o número de alunos. Usando valor estimado para cálculos.');
            // Estimativa de 30 alunos por computador para alunos
            results.rural.totalStudents = results.rural.studentComputers * 30;
            results.urban.totalStudents = results.urban.studentComputers * 30;
            results.total.totalStudents = results.total.studentComputers * 30;
        }
        
        // Imprimir resultados
        console.log(`📊 ANÁLISE DE COMPUTADORES (Processados ${processedCount} registros: ${ruralCount} rurais, ${urbanCount} urbanos)`);
        
        // Função para calcular e formatar porcentagens
        const calcPercentage = (part, total) => ((part / total) * 100).toFixed(2) + '%';
        
        // Escolas Rurais
        if (ruralCount > 0) {
            console.log('\n🌱 ESCOLAS RURAIS:');
            console.log(`Computadores administrativos: ${results.rural.adminComputers} (${calcPercentage(results.rural.adminComputers, results.rural.totalComputers)} do total)`);
            console.log(`Computadores para alunos: ${results.rural.studentComputers} (${calcPercentage(results.rural.studentComputers, results.rural.totalComputers)} do total)`);
            console.log(`Total de computadores: ${results.rural.totalComputers}`);
            
            if (results.rural.totalStudents > 0 && results.rural.studentComputers > 0) {
                const studentsPerComputer = (results.rural.totalStudents / results.rural.studentComputers).toFixed(2);
                console.log(`Relação alunos por computador: ${studentsPerComputer}:1 (${studentsPerComputer} alunos por computador)`);
                console.log(`Relação computadores por aluno: ${(results.rural.studentComputers / results.rural.totalStudents).toFixed(4)} computadores por aluno (${calcPercentage(results.rural.studentComputers, results.rural.totalStudents)})`);
            }
        }
        
        // Escolas Urbanas
        if (urbanCount > 0) {
            console.log('\n🏙️ ESCOLAS URBANAS:');
            console.log(`Computadores administrativos: ${results.urban.adminComputers} (${calcPercentage(results.urban.adminComputers, results.urban.totalComputers)} do total)`);
            console.log(`Computadores para alunos: ${results.urban.studentComputers} (${calcPercentage(results.urban.studentComputers, results.urban.totalComputers)} do total)`);
            console.log(`Total de computadores: ${results.urban.totalComputers}`);
            
            if (results.urban.totalStudents > 0 && results.urban.studentComputers > 0) {
                const studentsPerComputer = (results.urban.totalStudents / results.urban.studentComputers).toFixed(2);
                console.log(`Relação alunos por computador: ${studentsPerComputer}:1 (${studentsPerComputer} alunos por computador)`);
                console.log(`Relação computadores por aluno: ${(results.urban.studentComputers / results.urban.totalStudents).toFixed(4)} computadores por aluno (${calcPercentage(results.urban.studentComputers, results.urban.totalStudents)})`);
            }
        }
        
        // Total Geral
        console.log('\n📈 TOTAL GERAL:');
        console.log(`Computadores administrativos: ${results.total.adminComputers} (${calcPercentage(results.total.adminComputers, results.total.totalComputers)} do total)`);
        console.log(`Computadores para alunos: ${results.total.studentComputers} (${calcPercentage(results.total.studentComputers, results.total.totalComputers)} do total)`);
        console.log(`Total de computadores: ${results.total.totalComputers}`);
        
        if (results.total.totalStudents > 0 && results.total.studentComputers > 0) {
            const studentsPerComputer = (results.total.totalStudents / results.total.studentComputers).toFixed(2);
            console.log(`Relação alunos por computador: ${studentsPerComputer}:1 (${studentsPerComputer} alunos por computador)`);
            console.log(`Relação computadores por aluno: ${(results.total.studentComputers / results.total.totalStudents).toFixed(4)} computadores por aluno (${calcPercentage(results.total.studentComputers, results.total.totalStudents)})`);
        }
        
        // Comparação Rural vs Urbano
        if (ruralCount > 0 && urbanCount > 0) {
            console.log('\n⚖️ COMPARAÇÃO RURAL vs URBANO:');
            
            // Comparar proporção de computadores administrativos
            const ruralAdminPct = results.rural.adminComputers / results.rural.totalComputers;
            const urbanAdminPct = results.urban.adminComputers / results.urban.totalComputers;
            
            console.log(`Porcentagem de computadores administrativos - Rural: ${(ruralAdminPct * 100).toFixed(2)}%, Urbano: ${(urbanAdminPct * 100).toFixed(2)}%`);
            
            if (ruralAdminPct > urbanAdminPct) {
                console.log(`As escolas rurais têm ${((ruralAdminPct / urbanAdminPct) * 100 - 100).toFixed(2)}% mais computadores administrativos proporcionalmente`);
            } else {
                console.log(`As escolas urbanas têm ${((urbanAdminPct / ruralAdminPct) * 100 - 100).toFixed(2)}% mais computadores administrativos proporcionalmente`);
            }
            
            // Comparar relação de alunos por computador (se tivermos esses dados)
            if (results.rural.totalStudents > 0 && results.urban.totalStudents > 0 &&
                results.rural.studentComputers > 0 && results.urban.studentComputers > 0) {
                
                const ruralStudentPc = results.rural.studentComputers / results.rural.totalStudents;
                const urbanStudentPc = results.urban.studentComputers / results.urban.totalStudents;
                
                console.log(`Computadores por aluno - Rural: ${(ruralStudentPc * 100).toFixed(2)}%, Urbano: ${(urbanStudentPc * 100).toFixed(2)}%`);
                
                if (ruralStudentPc > urbanStudentPc) {
                    console.log(`As escolas rurais têm ${((ruralStudentPc / urbanStudentPc) * 100 - 100).toFixed(2)}% mais computadores por aluno`);
                } else {
                    console.log(`As escolas urbanas têm ${((urbanStudentPc / ruralStudentPc) * 100 - 100).toFixed(2)}% mais computadores por aluno`);
                }
            }
        }
        
    } catch (error) {
        console.error('❌ Erro ao processar os dados:', error.response?.data || error.message);
    }
}

// Executar a análise
calculateComputerPercentages();