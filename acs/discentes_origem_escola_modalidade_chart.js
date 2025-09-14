document.addEventListener('DOMContentLoaded', function() {
     fetch('dados_discentes_origem_escola_modalidade.json') 
        .then(response => response.json())
        .then(data => {
            const anos = data.anos;
            const datasets = data.datasets.map((dataset, index) => {
                const colors = [
                    'rgb(54, 162, 235)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgb(255, 99, 132)',
                    'rgba(255, 99, 132, 0.5)',
                ];
                const colorIndex = index % colors.length;
                return {
                    label: dataset.label,
                    data: dataset.data,
                    borderColor: colors[colorIndex],
                    backgroundColor: colors[colorIndex+1],
                    tension: 0.1
                };
            });

            const ctx = document.getElementById('discentesOrigemEscolaModalidadeChart').getContext('2d');
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
                            text: 'Origem dos Discentes por Tipo de Escola e Modalidade de Ensino'
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

            // Exportar para Excel
            document.getElementById('exportDiscentesOrigemEscolaModalidadeBtn').addEventListener('click', function() {
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
                XLSX.utils.book_append_sheet(wb, ws, "Origem Discentes Modalidade");
                XLSX.writeFile(wb, "origem_discentes_modalidade.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de origem dos discentes por modalidade:', error));
});




