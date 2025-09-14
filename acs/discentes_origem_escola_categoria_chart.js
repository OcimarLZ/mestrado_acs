document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DEBUG: Iniciando carregamento do gráfico de origem da escola por categoria ===');
    
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('ERRO: Chart.js não está disponível!');
        return;
    }
    console.log('✓ Chart.js está disponível');
    
    // Verificar se o canvas existe
    const canvas = document.getElementById('discentesOrigemEscolaCategoriaChart');
    if (!canvas) {
        console.error('ERRO: Canvas discentesOrigemEscolaCategoriaChart não encontrado!');
        return;
    }
    console.log('✓ Canvas encontrado:', canvas);
    
    console.log('Iniciando fetch dos dados...');
     fetch('dados_discentes_origem_escola_categoria.json') 
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error('Erro HTTP: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('✓ Dados carregados com sucesso:', data);
            const anos = data.anos;
            const datasets = data.datasets.map((dataset, index) => {
                const colors = [
                    'rgb(54, 162, 235)',
                    'rgb(255, 99, 132)',
                    'rgb(75, 192, 192)',
                    'rgb(255, 205, 86)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 159, 64)',
                    'rgb(199, 199, 199)',
                    'rgb(83, 102, 255)'
                ];
                const colorIndex = index % colors.length;
                return {
                    label: dataset.label,
                    data: dataset.data,
                    borderColor: colors[colorIndex],
                    backgroundColor: colors[colorIndex] + '33',
                    tension: 0.1
                };
            });

            const ctx = canvas.getContext('2d');
            console.log('✓ Contexto 2D obtido:', ctx);
            
            console.log('Criando gráfico com datasets:', datasets);
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
                            text: 'Origem dos Discentes por Tipo de Escola e Categoria Administrativa da IES'
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
            
            console.log('✓ Gráfico criado com sucesso!', chart);
        })
        .catch(error => {
            console.error('❌ ERRO ao carregar ou processar dados:', error);
            console.error('Stack trace:', error.stack);
        });
});




