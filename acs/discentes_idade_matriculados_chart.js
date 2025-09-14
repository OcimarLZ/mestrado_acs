document.addEventListener('DOMContentLoaded', function() {
     fetch('dados_discentes_idade_matriculados.json') 
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
                    'rgba(255, 159, 64, 0.5)'
                ];
                const colorIndex = index * 2;
                return {
                    label: dataset.label,
                    data: dataset.data,
                    borderColor: colors[colorIndex],
                    backgroundColor: colors[colorIndex+1],
                    tension: 0.1
                };
            });

            const ctx = document.getElementById('discentesIdadeMatriculadosChart').getContext('2d');
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
                            text: 'Idade dos Discentes Matriculados na Educação Superior em Chapecó'
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
            document.getElementById('exportDiscentesIdadeMatriculadosBtn').addEventListener('click', function() {
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
                XLSX.utils.book_append_sheet(wb, ws, "Idade Matriculados");
                XLSX.writeFile(wb, "idade_matriculados.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de idade dos matriculados:', error));
});




