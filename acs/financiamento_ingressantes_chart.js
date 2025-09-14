document.addEventListener('DOMContentLoaded', function () {
    console.log('Iniciando carregamento do gráfico de financiamento de ingressantes');
    console.log('Chart.js disponível:', typeof Chart !== 'undefined');
    
    const canvas = document.getElementById('financiamentoIngressantesChart');
    console.log('Canvas encontrado:', canvas);
    
    if (!canvas) {
        console.error('ERRO: Canvas financiamentoIngressantesChart não encontrado!');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('ERRO: Chart.js não está carregado!');
        return;
    }
    
    fetch('dados_financiamento_ingressantes.json') 
        .then(response => {
            console.log('Resposta do fetch:', response);
            return response.json();
        })
        .then(data => {
            console.log('Dados carregados:', data);
            const ctx = canvas.getContext('2d');

            const colors = {
                 'FIES': '#FF6384',
                 'FINANCIAMENTO': '#98C379', 
                 'PROUNI': '#FFCE56',
                 'PARFOR': '#1E3A8A'
             };

            const datasets = data.datasets.map((dataset, index) => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: colors[dataset.label] || '#98C379',
            }));

            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.anos,
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
                            text: 'Financiamento dos Ingressantes em Chapecó'
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
                                text: 'Número de Ingressantes'
                            }
                        }
                    }
                }
            });
            console.log('Gráfico de financiamento de ingressantes criado com sucesso!');

            // Exportar para Excel
            document.getElementById('exportFinanciamentoIngressantesBtn').addEventListener('click', function() {
                // Preparar dados para exportação
                const exportData = [];
                data.anos.forEach((ano, index) => {
                    const row = { Ano: ano };
                    data.datasets.forEach(dataset => {
                        row[dataset.label] = dataset.data[index];
                    });
                    exportData.push(row);
                });

                const ws = XLSX.utils.json_to_sheet(exportData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Financiamento Ingressantes");
                XLSX.writeFile(wb, "financiamento_ingressantes.xlsx");
            });
        })
        .catch(error => {
            console.error('Erro ao carregar dados do gráfico de financiamento de ingressantes:', error);
        });
});




