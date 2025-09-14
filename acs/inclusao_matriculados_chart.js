// Gráfico de Discentes Matriculados por Políticas de Inclusão
let inclusaoMatriculadosChart;

async function loadInclusaoMatriculadosData() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`dados_inclusao_matriculados.json?t=${timestamp}`);
        const data = await response.json();
        
        const anos = data.anos;
        const datasets = data.datasets;
        
        // Cores específicas para cada categoria
        const cores = {
            'Apoio social': '#FF6384',
            'Deficientes': '#36A2EB', 
            'Reserva vagas': '#FFCE56',
            'Reserva social': '#4BC0C0',
            'Reserva etnica': '#9966FF'
        };
        
        // Preparar dados para Chart.js
        const chartDatasets = datasets.map(dataset => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: cores[dataset.label] || '#999999',
            borderColor: cores[dataset.label] || '#999999',
            borderWidth: 2,
            fill: false,
            tension: 0.1
        }));
        
        return {
            labels: anos,
            datasets: chartDatasets
        };
    } catch (error) {
        console.error('Erro ao carregar dados de inclusão matriculados:', error);
        return null;
    }
}

async function createInclusaoMatriculadosChart() {
    const canvas = document.getElementById('inclusaoMatriculadosChart');
    if (!canvas) {
        console.error('Canvas #inclusaoMatriculadosChart não encontrado');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const data = await loadInclusaoMatriculadosData();
    
    if (!data) {
        console.error('Não foi possível carregar os dados');
        return;
    }
    
    // Destruir gráfico existente se houver
    if (inclusaoMatriculadosChart) {
        inclusaoMatriculadosChart.destroy();
    }
    
    inclusaoMatriculadosChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Discentes Matriculados por Políticas de Inclusão (2014-2023)'
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
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Número de Matriculados'
                    },
                    beginAtZero: true
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// Função para exportar dados para Excel
async function exportInclusaoMatriculadosToExcel() {
    const data = await loadInclusaoMatriculadosData();
    if (!data) return;
    
    // Criar dados para exportação
    const exportData = [];
    
    // Cabeçalho
    const header = ['Ano', ...data.datasets.map(d => d.label)];
    exportData.push(header);
    
    // Dados por ano
    data.labels.forEach((ano, index) => {
        const row = [ano];
        data.datasets.forEach(dataset => {
            row.push(dataset.data[index] || 0);
        });
        exportData.push(row);
    });
    
    // Converter para CSV e baixar
    const csvContent = exportData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'discentes_matriculados_inclusao.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Inicializar o gráfico quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        createInclusaoMatriculadosChart();
        // Adicionar evento ao botão de exportação
        const exportBtn = document.getElementById('exportInclusaoMatriculadosBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportInclusaoMatriculadosToExcel);
        }
    });
} else {
    createInclusaoMatriculadosChart();
    // Adicionar evento ao botão de exportação
    const exportBtn = document.getElementById('exportInclusaoMatriculadosBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportInclusaoMatriculadosToExcel);
    }
}




