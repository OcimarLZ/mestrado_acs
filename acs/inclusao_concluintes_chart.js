// Gráfico: Discentes Concluintes A Partir de Políticas de Inclusão
// Arquivo de dados: dados_inclusao_concluintes.json

let inclusaoConcluentesChart;

async function loadInclusaoConcluentesData() {
    try {
        const response = await fetch('dados_inclusao_concluintes.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar dados de inclusão concluintes:', error);
        return null;
    }
}

function createInclusaoConcluentesChart(data) {
    const canvas = document.getElementById('inclusaoConcluentesChart');
    if (!canvas) {
        console.error('Canvas #inclusaoConcluentesChart não encontrado');
        return;
    }

    const ctx = canvas.getContext('2d');
    
    // Destroi gráfico existente se houver
    if (inclusaoConcluentesChart) {
        inclusaoConcluentesChart.destroy();
    }

    // Prepara os datasets com cores específicas
    const datasets = [
        {
            label: 'Apoio social',
            data: data.datasets['Apoio social'],
            backgroundColor: '#FF6384',
            borderColor: '#FF6384',
            borderWidth: 1
        },
        {
            label: 'Deficientes',
            data: data.datasets['Deficientes'],
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1
        },
        {
            label: 'Reserva de vagas',
            data: data.datasets['Reserva de vagas'],
            backgroundColor: '#FFCE56',
            borderColor: '#FFCE56',
            borderWidth: 1
        },
        {
            label: 'Reserva social',
            data: data.datasets['Reserva social'],
            backgroundColor: '#4BC0C0',
            borderColor: '#4BC0C0',
            borderWidth: 1
        },
        {
            label: 'Reserva étnica',
            data: data.datasets['Reserva étnica'],
            backgroundColor: '#9966FF',
            borderColor: '#9966FF',
            borderWidth: 1
        }
    ];

    inclusaoConcluentesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.anos,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Discentes Concluintes A Partir de Políticas de Inclusão',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Ano'
                    },
                    stacked: true
                },
                y: {
                    title: {
                        display: true,
                        text: 'Número de Concluintes'
                    },
                    stacked: true,
                    beginAtZero: true
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            }
        }
    });
}

// Inicializa o gráfico quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async function() {
    const data = await loadInclusaoConcluentesData();
    if (data) {
        createInclusaoConcluentesChart(data);
    } else {
        console.error('Falha ao carregar dados para o gráfico de inclusão concluintes');
    }
});

// Função para exportar dados (se necessário)
function exportInclusaoConcluentesData() {
    // Implementar exportação se necessário
    console.log('Exportação de dados de inclusão concluintes');
}

// Event listener para o botão de exportação (se existir)
document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.getElementById('exportInclusaoConcluentesBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportInclusaoConcluentesData);
    }
});