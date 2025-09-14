document.addEventListener('DOMContentLoaded', function() {
     fetch('dados_populacao_chapeco.json') 
        .then(response => response.json())
        .then(data => {
            const anos = data.anos;
            const populacaoTotal = data.populacao_total;
            const populacao18a24 = data.populacao_18_24;

            const datasets = [
                {
                    label: 'População Total de Chapecó',
                    data: populacaoTotal,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'População de 18 a 24 anos',
                    data: populacao18a24,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1
                }
            ];

            const ctx = document.getElementById('populacaoChapecoChart').getContext('2d');
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
                            text: 'Evolução da População de Chapecó (2014-2024)'
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
                                text: 'População'
                            },
                            beginAtZero: false
                        }
                    }
                }
            });

            // Exportar para Excel
            document.getElementById('exportPopulacaoChapecoBtn').addEventListener('click', function() {
                const dataToExport = anos.map((ano, index) => ({
                    Ano: ano,
                    'População Total': populacaoTotal[index],
                    'População 18 a 24 anos': populacao18a24[index]
                }));
                const ws = XLSX.utils.json_to_sheet(dataToExport);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "População Chapecó");
                XLSX.writeFile(wb, "populacao_chapeco.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de população de Chapecó:', error));
});




