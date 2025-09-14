document.addEventListener('DOMContentLoaded', function() {
     fetch('dados_meta12_pne.json') 
        .then(response => response.json())
        .then(data => {
            const anos = data.anos;

            const datasets = [
                {
                    label: 'Taxa Bruta',
                    data: data.taxa_bruta,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Taxa Líquida',
                    data: data.taxa_liquida,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Meta Bruta (50%)',
                    data: data.meta_bruta,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderDash: [5, 5],
                    tension: 0.1
                },
                {
                    label: 'Meta Líquida (33%)',
                    data: data.meta_liquida,
                    borderColor: 'rgb(255, 205, 86)',
                    backgroundColor: 'rgba(255, 205, 86, 0.5)',
                    borderDash: [5, 5],
                    tension: 0.1
                }
            ];

            const ctx = document.getElementById('meta12PneChart').getContext('2d');
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
                            text: 'Acompanhamento da Meta 12 do PNE (2014-2024) em Chapecó'
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
                                text: 'Taxa de Escolarização (%)'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });

            // Exportar para Excel
            document.getElementById('exportMeta12PneBtn').addEventListener('click', function() {
                const dataToExport = anos.map((ano, index) => ({
                    Ano: ano,
                    'Taxa Bruta': data.taxa_bruta[index],
                    'Taxa Líquida': data.taxa_liquida[index],
                    'Meta Bruta': data.meta_bruta[index],
                    'Meta Líquida': data.meta_liquida[index]
                }));
                const ws = XLSX.utils.json_to_sheet(dataToExport);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Meta 12 PNE");
                XLSX.writeFile(wb, "meta12_pne.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico da Meta 12 do PNE:', error));
});




