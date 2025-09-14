document.addEventListener('DOMContentLoaded', function() {
     fetch('dados_discentes_idade_concluintes_modalidade.json') 
        .then(response => response.json())
        .then(data => {
            const anos = data.anos;
            const datasets = data.datasets.map((dataset, index) => {
                const colors = [
                    'rgb(54, 162, 235)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgb(255, 99, 132)',
                    'rgba(255, 99, 132, 0.5)',
                    'rgb(75, 192, 192)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgb(255, 205, 86)',
                    'rgba(255, 205, 86, 0.5)',
                    'rgb(153, 102, 255)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgb(255, 159, 64)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgb(201, 203, 207)',
                    'rgba(201, 203, 207, 0.5)',
                    'rgb(231, 84, 128)',
                    'rgba(231, 84, 128, 0.5)',
                    'rgb(140, 213, 145)',
                    'rgba(140, 213, 145, 0.5)',
                    'rgb(245, 172, 100)',
                    'rgba(245, 172, 100, 0.5)',
                    'rgb(162, 134, 245)',
                    'rgba(162, 134, 245, 0.5)',
                    'rgb(245, 134, 134)',
                    'rgba(245, 134, 134, 0.5)'
                ];
                const colorIndex = index * 2;
                return {
                    label: dataset.label,
                    data: dataset.data,
                    borderColor: colors[colorIndex % colors.length],
                    backgroundColor: colors[(colorIndex + 1) % colors.length],
                    tension: 0.1
                };
            });

            const ctx = document.getElementById('discentesIdadeConcluintesModalidadeChart').getContext('2d');
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
                            text: 'Idade dos Discentes Concluintes por Modalidade de Ensino'
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
                                text: 'Quantidade de Concluintes'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });

            // Exportar para Excel
            document.getElementById('exportDiscentesIdadeConcluintesModalidadeBtn').addEventListener('click', function() {
                const dataToExport = [];
                for (let i = 0; i < anos.length; i++) {
                    const row = { Ano: anos[i] };
                    for (const dataset of data.datasets) {
                        row[dataset.label] = dataset.data[i];
                    }
                    dataToExport.push(row);
                }

                const ws = XLSX.utils.json_to_sheet(dataToExport);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Idade Concluintes Modalidade");
                XLSX.writeFile(wb, "idade_concluintes_modalidade.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de idade dos concluintes por modalidade:', error));
});




