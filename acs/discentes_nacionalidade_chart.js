
document.addEventListener('DOMContentLoaded', function () {
     fetch('dados_discentes_nacionalidade.json') 
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('discentesNacionalidadeChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.anos,
                    datasets: [
                        {
                            label: 'Brasileiros',
                            data: data.brasileiros,
                            backgroundColor: 'rgba(75, 192, 192, 0.7)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Estrangeiros',
                            data: data.estrangeiros,
                            backgroundColor: 'rgba(153, 102, 255, 0.7)',
                            borderColor: 'rgba(153, 102, 255, 1)',
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
                            text: 'Distribuição de Nacionalidade dos Discentes em Chapecó (2014-2023)',
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
            document.getElementById('exportDiscentesNacionalidadeBtn').addEventListener('click', function() {
                const workbook = XLSX.utils.book_new();
                
                // Prepara os dados para a planilha
                const worksheetData = [];
                const headers = ['Ano', 'Brasileiros', 'Estrangeiros'];
                worksheetData.push(headers);

                data.anos.forEach((ano, index) => {
                    worksheetData.push([
                        ano,
                        data.brasileiros[index],
                        data.estrangeiros[index]
                    ]);
                });

                const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Discentes-Nacionalidade');
                XLSX.writeFile(workbook, 'distribuicao_nacionalidade_discentes.xlsx');
            });
        });
});




