document.addEventListener('DOMContentLoaded', function() {
     fetch('analise_ies_unochapeco.json') 
        .then(response => response.json())
        .then(data => {
            const anos = [...new Set(data.map(item => item.ano_censo))].sort();

            const datasets = [
                {
                    label: 'Matrículas',
                    data: anos.map(ano => data.find(item => item.ano_censo === ano)?.matriculas || 0),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.3,
                    fill: false,
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        rotation: 0
                    }
                },
                {
                    label: 'Ingressos',
                    data: anos.map(ano => data.find(item => item.ano_censo === ano)?.ingressos || 0),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    tension: 0.3,
                    fill: false,
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        rotation: 0
                    }
                },
                {
                    label: 'Concluintes',
                    data: anos.map(ano => data.find(item => item.ano_censo === ano)?.concluintes || 0),
                    borderColor: 'rgb(255, 205, 86)',
                    backgroundColor: 'rgba(255, 205, 86, 0.5)',
                    tension: 0.3,
                    fill: false,
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        rotation: 0
                    }
                },
                {
                    label: 'Trancados',
                    data: anos.map(ano => data.find(item => item.ano_censo === ano)?.trancados || 0),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.3,
                    fill: false,
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        rotation: 0
                    }
                },
                {
                    label: 'Evadidos',
                    data: anos.map(ano => data.find(item => item.ano_censo === ano)?.evadidos || 0),
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    tension: 0.3,
                    fill: false,
                    datalabels: {
                        align: 'top',
                        anchor: 'end',
                        rotation: 0
                    }
                }
            ];

            const ctx = document.getElementById('analiseIesUnochapecoChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: anos,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Dinâmica da Unochapecó (2014-2024)'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        },
                        datalabels: {
                            display: false, // Hide by default due to clutter
                            formatter: function(value) {
                                return value.toLocaleString();
                            },
                            font: {
                                weight: 'bold'
                            }
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
                                text: 'Quantidade'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });

            document.getElementById('exportAnaliseIesUnochapecoBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Unochapeco");
                XLSX.writeFile(wb, "analise_ies_unochapeco.xlsx");
            });

        })
        .catch(error => console.error('Erro ao carregar dados do gráfico da Unochapecó:', error));
});




