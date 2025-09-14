console.log("Executing financiamento_matriculados_chart.js");
document.addEventListener('DOMContentLoaded', function() {
     fetch('dados_financiamento_matriculados.json') 
        .then(response => response.json())
        .then(data => {
            const anos = data.anos;
            const colors = {
                 'FIES': '#FF6384',
                 'FINANCIAMENTO': '#98C379', 
                 'PROUNI': '#FFCE56',
                 'PARFOR': '#1E3A8A'
            };
            const datasets = data.datasets.map((dataset, index) => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: colors[dataset.label] || '#98C379'
            }));

            const canvas = document.getElementById('financiamentoMatriculadosChart');
            console.log('Canvas financiamentoMatriculadosChart encontrado:', canvas);
            
            if (!canvas) {
                console.error('ERRO: Canvas financiamentoMatriculadosChart não encontrado!');
                return;
            }
            
            const ctx = canvas.getContext('2d');
            const chart = new Chart(ctx, {
                type: 'bar',
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
                            text: 'Análise das fontes de financiamento dos matriculados na educação superior em Chapecó'
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Ano'
                            }
                        },
                        y: {
                            stacked: true,
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Número de Matriculados'
                            }
                        }
                    }
                }
            });

            // Funcionalidade de exportação removida - botão não existe no HTML
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de financiamento de matriculados:', error));
});




