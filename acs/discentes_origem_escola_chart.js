document.addEventListener('DOMContentLoaded', function() {
     fetch('dados_discentes_origem_escola.json') 
        .then(response => response.json())
        .then(data => {
            const anos = data.anos;

            const datasets = [
                {
                    label: 'Pública',
                    data: data.publica,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Privada',
                    data: data.privada,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1
                }
            ];

            const ctx = document.getElementById('discentesOrigemEscolaChart').getContext('2d');
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
                            text: 'Origem dos Discentes por Tipo de Escola na Formação Secundária'
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
            document.getElementById('exportDiscentesOrigemEscolaBtn').addEventListener('click', function() {
                const dataToExport = anos.map((ano, index) => ({
                    Ano: ano,
                    Publica: data.publica[index],
                    Privada: data.privada[index]
                }));
                const ws = XLSX.utils.json_to_sheet(dataToExport);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Origem Discentes");
                XLSX.writeFile(wb, "origem_discentes.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de origem dos discentes:', error));
});




