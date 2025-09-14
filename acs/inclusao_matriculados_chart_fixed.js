console.log('Executing inclusao_matriculados_chart_fixed.js');

document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading inclusao_matriculados_chart_fixed.js - DOM ready');
    fetch('dados_inclusao_matriculados.json') 
        .then(response => {
            console.log('Fetch response for inclusao_matriculados:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data loaded successfully:', data);
            const anos = data.anos;

            // Definir cores para cada categoria
            const cores = [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(153, 102, 255)',
                'rgb(255, 159, 64)',
                'rgb(199, 199, 199)',
                'rgb(83, 102, 147)'
            ];

            // Usar os datasets que já vêm do JSON
            const datasets = data.datasets.map((dataset, index) => ({
                label: dataset.label,
                data: dataset.data,
                borderColor: cores[index % cores.length],
                backgroundColor: cores[index % cores.length].replace('rgb', 'rgba').replace(')', ', 0.2)'),
                tension: 0.1
            }));

            const ctx = document.getElementById('inclusaoMatriculadosChart').getContext('2d');
            const chart = new Chart(ctx, {
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
                            text: 'Análise das variáveis com perspectiva de inclusão na educação superior de Chapecó'
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
                                text: 'Quantidade de Matrículas'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });

            console.log('Chart created successfully:', chart);
        })
        .catch(error => {
            console.error('Erro ao carregar dados para o gráfico de inclusão de matriculados:', error);
            console.error('Error details:', error.stack);
        });
});