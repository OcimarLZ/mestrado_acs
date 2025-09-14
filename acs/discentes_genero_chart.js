document.addEventListener('DOMContentLoaded', function() {
    fetch('dados_discentes_genero_chapeco.json')
        .then(response => response.json())
        .then(data => {
            const anos = data.map(d => d.ano);
            const datasets = [
                {
                    label: 'Ingressos Masculino',
                    data: data.map(d => d.ingressos_masc),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Ingressos Feminino',
                    data: data.map(d => d.ingressos_fem),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Matrículas Masculino',
                    data: data.map(d => d.matriculas_masc),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Matrículas Feminino',
                    data: data.map(d => d.matriculas_fem),
                    borderColor: 'rgb(255, 205, 86)',
                    backgroundColor: 'rgba(255, 205, 86, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Concluintes Masculino',
                    data: data.map(d => d.concluintes_masc),
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Concluintes Feminino',
                    data: data.map(d => d.concluintes_fem),
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                    tension: 0.1
                }
            ];

            const ctx = document.getElementById('discentesGeneroChart').getContext('2d');
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
                            text: 'Evolução de Discentes por Gênero em Chapecó (2014-2023)'
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
                                text: 'Número de Discentes'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });

            // Exportar para Excel
            document.getElementById('exportDiscentesGeneroBtn').addEventListener('click', function() {
                const dataToExport = anos.map((ano, index) => ({
                    Ano: ano,
                    'Masculino': data.masculino[index],
                    'Feminino': data.feminino[index]
                }));
                const ws = XLSX.utils.json_to_sheet(dataToExport);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Discentes por Gênero");
                XLSX.writeFile(wb, "evolucao_discentes_genero.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de discentes por gênero:', error));
});