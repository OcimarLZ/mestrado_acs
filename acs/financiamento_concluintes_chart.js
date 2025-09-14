document.addEventListener('DOMContentLoaded', function () {
    console.log('Iniciando carregamento do gráfico de financiamento de concluintes');
    console.log('Chart.js disponível:', typeof Chart !== 'undefined');
    
    const canvas = document.getElementById('financiamentoConcluintesChart');
    console.log('Canvas encontrado:', canvas);
    
    if (!canvas) {
        console.error('ERRO: Canvas financiamentoConcluintesChart não encontrado!');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('ERRO: Chart.js não está carregado!');
        return;
    }
    
    fetch('dados_financiamento_concluintes.json') 
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados carregados:', data);
            
            // Extrair anos e dados da estrutura correta
            const anos = data.anos;
            const fiesData = data.datasets.FIES;
            const prouniData = data.datasets.PROUNI;
            const financiamentoData = data.datasets.Financiamento;
            const parforData = data.datasets.PARFOR;
            
            const colors = {
                'FIES': '#FF6384',
                'FINANCIAMENTO': '#98C379', 
                'PROUNI': '#FFCE56',
                'PARFOR': '#1E3A8A'
            };
            
            const ctx = canvas.getContext('2d');

            // Preparar dados para o Chart.js
            const datasets = [
                {
                    label: 'FIES',
                    data: fiesData,
                    backgroundColor: colors['FIES'],
                    borderColor: colors['FIES'],
                    borderWidth: 1
                },
                {
                    label: 'FINANCIAMENTO',
                    data: financiamentoData,
                    backgroundColor: colors['FINANCIAMENTO'],
                    borderColor: colors['FINANCIAMENTO'],
                    borderWidth: 1
                },
                {
                    label: 'PROUNI',
                    data: prouniData,
                    backgroundColor: colors['PROUNI'],
                    borderColor: colors['PROUNI'],
                    borderWidth: 1
                },
                {
                    label: 'PARFOR',
                    data: parforData,
                    backgroundColor: colors['PARFOR'],
                    borderColor: colors['PARFOR'],
                    borderWidth: 1
                }
            ];

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: anos,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Financiamento dos Concluintes (2014-2023)',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            position: 'top'
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
                            title: {
                                display: true,
                                text: 'Número de Concluintes'
                            }
                        }
                    }
                }
            });
            console.log('Gráfico de financiamento de concluintes criado com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao carregar dados do gráfico de financiamento de concluintes:', error);
            console.error('Detalhes do erro:', error.message);
        });
});




