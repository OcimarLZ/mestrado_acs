// Gráfico de Discentes Matriculados A Partir de Políticas de Inclusão - Rede Privada

// Função para carregar dados do JSON
async function loadInclusaoMatriculadosPrivadaData() {
    try {
        const timestamp = new Date().getTime();
        const response = await fetch(`dados_inclusao_matriculados_privada.json?t=${timestamp}`);
        const data = await response.json();
        
        // Processar dados para o formato do Chart.js
        const processedData = {
            labels: data.anos,
            datasets: data.datasets.map((dataset, index) => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: getColorByIndex(index),
                borderColor: getColorByIndex(index),
                borderWidth: 1
            }))
        };
        
        return processedData;
    } catch (error) {
        console.error('Erro ao carregar dados de inclusão matriculados rede privada:', error);
        return null;
    }
}

// Função para obter cores por índice
function getColorByIndex(index) {
    const colors = [
        'rgba(54, 162, 235, 0.8)',   // Azul
        'rgba(255, 99, 132, 0.8)',   // Vermelho
        'rgba(255, 206, 86, 0.8)',   // Amarelo
        'rgba(75, 192, 192, 0.8)',   // Verde
        'rgba(153, 102, 255, 0.8)'   // Roxo
    ];
    return colors[index % colors.length];
}

// Função para criar o gráfico
async function createInclusaoMatriculadosPrivadaChart() {
    const canvas = document.getElementById('inclusaoMatriculadosPrivadaChart');
    if (!canvas) {
        console.error('Canvas #inclusaoMatriculadosPrivadaChart não encontrado');
        return;
    }

    const data = await loadInclusaoMatriculadosPrivadaData();
    if (!data) {
        console.error('Não foi possível carregar os dados do gráfico');
        return;
    }

    const ctx = canvas.getContext('2d');
    
    window.inclusaoMatriculadosPrivadaChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Discentes Matriculados A Partir de Políticas de Inclusão - Rede Privada',
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
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Número de Discentes'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Ano'
                    }
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
function exportInclusaoMatriculadosPrivadaToExcel() {
    if (!window.inclusaoMatriculadosPrivadaChart) {
        alert('Gráfico não encontrado. Certifique-se de que o gráfico foi carregado.');
        return;
    }

    const chart = window.inclusaoMatriculadosPrivadaChart;
    const data = chart.data;
    
    // Criar dados para exportação
    const exportData = [];
    
    // Cabeçalho
    const header = ['Ano', ...data.datasets.map(dataset => dataset.label)];
    exportData.push(header);
    
    // Dados
    data.labels.forEach((label, index) => {
        const row = [label];
        data.datasets.forEach(dataset => {
            row.push(dataset.data[index] || 0);
        });
        exportData.push(row);
    });
    
    // Criar worksheet
    const ws = XLSX.utils.aoa_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inclusão Matriculados Privada');
    
    // Salvar arquivo
    XLSX.writeFile(wb, 'inclusao_matriculados_privada.xlsx');
}

// Inicializar o gráfico quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    createInclusaoMatriculadosPrivadaChart();
});