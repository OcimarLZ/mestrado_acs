
document.addEventListener('DOMContentLoaded', function () {
     fetch('dados_discentes_deficiencia.json') 
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('discentesDeficienciaChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.anos,
                    datasets: [
                        {
                            label: 'Total de Discentes com Deficiência',
                            data: data.total_deficientes,
                            backgroundColor: 'rgba(255, 159, 64, 0.7)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Evolução de Discentes com Deficiência em Chapecó (2014-2023)',
                            font: {
                                size: 18
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
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
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Número de Discentes'
                            }
                        }
                    }
                }
            });

            // Botão de exportação
            document.getElementById('exportDiscentesDeficienciaBtn').addEventListener('click', function() {
                const workbook = XLSX.utils.book_new();
                
                // Prepara os dados para a planilha
                const worksheetData = [];
                const headers = ['Ano', 'Total de Discentes com Deficiência'];
                worksheetData.push(headers);

                data.anos.forEach((ano, index) => {
                    worksheetData.push([
                        ano,
                        data.total_deficientes[index]
                    ]);
                });

                const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Discentes-Deficiencia');
                XLSX.writeFile(workbook, 'evolucao_discentes_deficiencia.xlsx');
            });
        });
});




