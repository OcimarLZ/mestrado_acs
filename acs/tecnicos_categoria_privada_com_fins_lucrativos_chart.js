document.addEventListener('DOMContentLoaded', function () {
     fetch('dados_tecnicos_categoria_privada_com_fins_lucrativos.json') 
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('tecnicosCategoriaPrivadaComFinsLucrativosChart').getContext('2d');

            const titulacaoData = {
                'Doutores': data.doutores,
                'Mestres': data.mestres,
                'Especialistas': data.especialistas,
                'Superior': data.superior,
                'Médio': data.medio,
                'Fundamental': data.fundamental,
                'Fund. Incompleto': data.fundamental_incompleto
            };

            const backgroundColors = [
                'rgba(255, 99, 132, 0.7)',
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
                'rgba(153, 102, 255, 0.7)',
                'rgba(255, 159, 64, 0.7)',
                'rgba(199, 199, 199, 0.7)'
            ];

            const borderColors = [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)'
            ];

            const datasets = [];

            let colorIndex = 0;
            for (const [key, value] of Object.entries(titulacaoData)) {
                datasets.push({
                    label: key,
                    data: value,
                    backgroundColor: backgroundColors[colorIndex % backgroundColors.length],
                    borderColor: borderColors[colorIndex % borderColors.length],
                    type: 'line',
                    fill: false,
                    tension: 0.1
                });
                colorIndex++;
            }

            const tecnicosCategoriaPrivadaComFinsLucrativosChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.anos,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: {
                            top: 10,
                            bottom: 10
                        }
                    },
                    plugins: {
                        legend: { 
                            position: 'top',
                            labels: {
                                boxWidth: 20
                            }
                        },
                        title: {
                            display: true,
                            text: 'Evolução do Corpo Técnico-Administrativo por Titulação - Privada com Fins Lucrativos (2014-2023)',
                            font: {
                                size: 18
                            }
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        },
                    },
                    scales: {
                        x: {
                            type: 'linear',
                            title: {
                                display: true,
                                text: 'Ano'
                            }
                        },
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: 'Número por Titulação'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });

            // Botão de exportação
            document.getElementById('exportTecnicosCategoriaPrivadaComFinsLucrativosBtn').addEventListener('click', function() {
                const workbook = XLSX.utils.book_new();
                
                // Prepara os dados para a planilha
                const worksheetData = [];
                const headers = ['Ano', 'Doutores', 'Mestres', 'Especialistas', 'Superior', 'Médio', 'Fundamental', 'Fund. Incompleto'];
                worksheetData.push(headers);

                data.anos.forEach((ano, index) => {
                    worksheetData.push([
                        ano,
                        data.doutores[index],
                        data.mestres[index],
                        data.especialistas[index],
                        data.superior[index],
                        data.medio[index],
                        data.fundamental[index],
                        data.fundamental_incompleto[index]
                    ]);
                });

                const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Tecnicos-PrivadaComFinsLucrativos');
                XLSX.writeFile(workbook, 'evolucao_tecnicos_titulacao_privada_com_fins_lucrativos.xlsx');
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de técnicos privados com fins lucrativos:', error));
});




