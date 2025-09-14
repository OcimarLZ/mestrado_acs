
document.addEventListener('DOMContentLoaded', function () {
     fetch('dados_discentes_raca.json') 
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('discentesRacaChart').getContext('2d');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: data.anos,
                    datasets: [
                        {
                            label: 'Branca',
                            data: data.branca,
                            backgroundColor: 'rgba(255, 99, 132, 0.7)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Preta',
                            data: data.preta,
                            backgroundColor: 'rgba(54, 162, 235, 0.7)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Parda',
                            data: data.parda,
                            backgroundColor: 'rgba(255, 206, 86, 0.7)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Amarela',
                            data: data.amarela,
                            backgroundColor: 'rgba(75, 192, 192, 0.7)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Indígena',
                            data: data.indigena,
                            backgroundColor: 'rgba(153, 102, 255, 0.7)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Cor Não Declarada',
                            data: data.cor_nao_declarada,
                            backgroundColor: 'rgba(201, 203, 207, 0.7)',
                            borderColor: 'rgba(201, 203, 207, 1)',
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
                            text: 'Distribuição de Raça/Cor dos Discentes em Chapecó (2014-2023)',
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
            document.getElementById('exportDiscentesRacaBtn').addEventListener('click', function() {
                const workbook = XLSX.utils.book_new();
                
                // Prepara os dados para a planilha
                const worksheetData = [];
                const headers = ['Ano', 'Branca', 'Preta', 'Parda', 'Amarela', 'Indígena', 'Cor Não Declarada'];
                worksheetData.push(headers);

                data.anos.forEach((ano, index) => {
                    worksheetData.push([
                        ano,
                        data.branca[index],
                        data.preta[index],
                        data.parda[index],
                        data.amarela[index],
                        data.indigena[index],
                        data.cor_nao_declarada[index]
                    ]);
                });

                const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Discentes-Raca');
                XLSX.writeFile(workbook, 'distribuicao_raca_discentes.xlsx');
            });
        });
});




