document.addEventListener('DOMContentLoaded', function() {
     fetch('cursos_por_categoria.json') 
        .then(response => response.json())
        .then(data => {
            const anos = data.map(item => item.ano);
            const categorias = Object.keys(data[0]).filter(key => key !== 'ano'); // Exclui 'ano'

            const datasets = categorias.map(categoria => {
                return {
                    label: categoria.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Formata o nome da categoria
                    data: data.map(item => item[categoria]),
                    fill: false,
                    tension: 0.1
                };
            });

            const ctx = document.getElementById('cursosPorCategoriaChart').getContext('2d');
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
                            text: 'Quantitativo de Cursos por Categoria Administrativa'
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
            document.getElementById('exportCursosPorCategoriaBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Cursos por Categoria");
                XLSX.writeFile(wb, "cursos_por_categoria.xlsx");
            });

        })
        .catch(error => console.error('Erro ao carregar dados do gráfico de cursos por categoria:', error));
});




