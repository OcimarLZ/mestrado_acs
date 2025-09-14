document.addEventListener('DOMContentLoaded', function() {
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('ERRO: Chart.js não está carregado!');
        return;
    }
    
    // Verificar se o canvas existe
    const canvas = document.getElementById('docentesRacaChart');
    if (!canvas) {
        console.error('ERRO: Canvas docentesRacaChart não encontrado!');
        return;
    }
    
     fetch('dados_docentes_raca.json') 
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                console.error('No data received for chart');
                return;
            }
            const anos = data.map(item => item.ano);

            const datasets = [
                { label: 'Branca', data: data.map(item => item.branca), borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)', tension: 0.1 },
                { label: 'Preta', data: data.map(item => item.preta), borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.5)', tension: 0.1 },
                { label: 'Parda', data: data.map(item => item.parda), borderColor: 'rgb(255, 205, 86)', backgroundColor: 'rgba(255, 205, 86, 0.5)', tension: 0.1 },
                { label: 'Amarela', data: data.map(item => item.amarela), borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)', tension: 0.1 },
                { label: 'Indígena', data: data.map(item => item.indigena), borderColor: 'rgb(153, 102, 255)', backgroundColor: 'rgba(153, 102, 255, 0.5)', tension: 0.1 },
                { label: 'Cor ND', data: data.map(item => item.cor_nd), borderColor: 'rgb(255, 159, 64)', backgroundColor: 'rgba(255, 159, 64, 0.5)', tension: 0.1 }
            ];

            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: anos,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Evolução da Raça/Cor dos Docentes em Chapecó (2014-2024)'
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
                                text: 'Quantidade'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });

            // Exportar para Excel
            document.getElementById('exportDocentesRacaBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Docentes por Raça");
                XLSX.writeFile(wb, "docentes_por_raca.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de raça dos docentes:', error));
});




