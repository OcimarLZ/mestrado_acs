document.addEventListener('DOMContentLoaded', function() {
     fetch('cursos_por_modalidade.json') 
        .then(response => response.json())
        .then(data => {
            const anos = data.map(item => item.ano);

            const datasets = [
                {
                    label: 'Presencial',
                    data: data.map(item => item.presencial),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'A Distância',
                    data: data.map(item => item.distancia),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    fill: false,
                    tension: 0.1
                }
            ];

            const ctx = document.getElementById('cursosPorModalidadeChart').getContext('2d');
            new Chart(ctx, {
                type: 'line', // Pode ser 'bar' também
                data: {
                    labels: anos,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Quantitativo de Cursos por Modalidade de Ensino'
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
                            title: {
                                display: true,
                                text: 'Número de Cursos'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });

            // Exportar para Excel
            document.getElementById('exportCursosPorModalidadeBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Cursos por Modalidade");
                XLSX.writeFile(wb, "cursos_por_modalidade.xlsx");
            });

        })
        .catch(error => console.error('Erro ao carregar dados do gráfico de cursos por modalidade:', error));
});




