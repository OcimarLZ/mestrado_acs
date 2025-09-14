
document.addEventListener('DOMContentLoaded', function() {
     fetch('dados_docentes_nacionalidade.json') 
        .then(response => response.json())
        .then(data => {
            const anos = data.map(item => item.ano);

            const datasets = [
                {
                    label: 'Brasileiros',
                    data: data.map(item => item.brasileiros),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Estrangeiros',
                    data: data.map(item => item.estrangeiros),
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                    tension: 0.1
                }
            ];

            const ctx = document.getElementById('docentesNacionalidadeChart').getContext('2d');
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
                            text: 'Evolução da Nacionalidade dos Docentes em Chapecó (2014-2024)'
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

            // Exportar para Excel
            document.getElementById('exportDocentesNacionalidadeBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Docentes por Nacionalidade");
                XLSX.writeFile(wb, "docentes_por_nacionalidade.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de nacionalidade dos docentes:', error));
});




