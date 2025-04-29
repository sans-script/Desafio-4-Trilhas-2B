// Dados fictícios - substituir por API real
const educationData = {
    years: ['2018', '2019', '2020', '2021', '2022', '2023'],
    enrollments: [980000, 1050000, 1100000, 1150000, 1200000, 1250000],
    modalities: ['Ensino Regular', 'EJA', 'Educação Especial', 'Profissionalizante'],
    modalityValues: [900000, 200000, 100000, 50000],
    infrastructure: {
        avgComputers: 1.2,
        workingComputers: 82,
        schoolsWithTablets: 58,
        devicesPerSchool: 3.1,
        urbanInternet: 92,
        ruralInternet: 42,
        broadband: 68
    },
    pedagogical: {
        teachersUsingTech: 65,
        schoolsWithIT: 47,
        techPrograms: 38
    }
};

// Atualiza os cards de resumo
document.getElementById('totalEnrollments').textContent = 
    educationData.enrollments[5].toLocaleString('pt-BR');
document.getElementById('schoolsWithInternet').textContent = 
    `${Math.round((educationData.infrastructure.urbanInternet + educationData.infrastructure.ruralInternet) / 2)}%`;
document.getElementById('teachersWithTech').textContent = 
    `${educationData.pedagogical.teachersUsingTech}%`;
document.getElementById('ruralSchoolsInternet').textContent = 
    `${educationData.infrastructure.ruralInternet}%`;

// Atualiza as informações detalhadas
document.getElementById('avgComputers').textContent = educationData.infrastructure.avgComputers;
document.getElementById('workingComputers').textContent = `${educationData.infrastructure.workingComputers}%`;
document.getElementById('schoolsWithTablets').textContent = `${educationData.infrastructure.schoolsWithTablets}%`;
document.getElementById('devicesPerSchool').textContent = educationData.infrastructure.devicesPerSchool;
document.getElementById('teachersUsingTech').textContent = `${educationData.pedagogical.teachersUsingTech}%`;
document.getElementById('schoolsWithIT').textContent = `${educationData.pedagogical.schoolsWithIT}%`;
document.getElementById('techPrograms').textContent = `${educationData.pedagogical.techPrograms}%`;
document.getElementById('urbanInternet').textContent = `${educationData.infrastructure.urbanInternet}%`;
document.getElementById('ruralInternet').textContent = `${educationData.infrastructure.ruralInternet}%`;
document.getElementById('broadband').textContent = `${educationData.infrastructure.broadband}%`;

// Configurações comuns para os gráficos
const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (ctx) => {
                    const label = ctx.dataset.label || '';
                    const value = typeof ctx.raw === 'number' 
                        ? ctx.raw.toLocaleString('pt-BR') 
                        : ctx.raw;
                    return `${label}: ${value}`;
                }
            }
        }
    },
    scales: {
        y: {
            ticks: {
                callback: (value) => (value/1000) + ' mil'
            },
            grid: {
                color: 'rgba(0,0,0,0.05)'
            }
        },
        x: {
            grid: {
                display: false
            }
        }
    }
};
new Chart(
    document.getElementById('evolutionChart'),
    {
        type: 'line',
        data: {
            labels: educationData.years,
            datasets: [{
                label: 'Matrículas',
                data: educationData.enrollments,
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            ...chartConfig,
            scales: {
                y: {
                    ...chartConfig.scales.y,
                    beginAtZero: false
                }
            }
        }
    }
);
new Chart(
    document.getElementById('modalityChart'),
    {
        type: 'bar',
        data: {
            labels: educationData.modalities,
            datasets: [{
                label: 'Alunos Matriculados',
                data: educationData.modalityValues,
                backgroundColor: [
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(231, 76, 60, 0.7)',
                    'rgba(243, 156, 18, 0.7)'
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(231, 76, 60, 1)',
                    'rgba(243, 156, 18, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            ...chartConfig,
            scales: {
                y: {
                    ...chartConfig.scales.y,
                    beginAtZero: true
                }
            }
        }
    }
);
async function loadRealData() {
    try {
        const response = await fetch('');
        const realData = await response.json();
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}
document.addEventListener('DOMContentLoaded', loadRealData);
