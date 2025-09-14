document.addEventListener('DOMContentLoaded', function() {
     fetch('educacao_superior_por_categoria_concluintes.json') 
        .then(response => response.json())
        .then(data => {
            const anos = [...new Set(data.map(item => item.ano_censo))].sort();
            const categorias = [...new Set(data.map(item => item.categoria))];

            const datasets = [];

            const colors = [
                'rgb(255, 99, 132)',    // Vermelho
                'rgb(54, 162, 235)',    // Azul
                'rgb(255, 205, 86)',    // Amarelo
                'rgb(75, 192, 192)',    // Verde Água
                'rgb(153, 102, 255)',   // Roxo
                'rgb(255, 159, 64)',    // Laranja
                'rgb(201, 203, 207)',   // Cinza
                'rgb(255, 0, 0)',       // Vermelho puro
                'rgb(0, 0, 255)',       // Azul puro
                'rgb(0, 255, 0)',       // Verde puro
                'rgb(255, 0, 255)',     // Magenta
                'rgb(0, 255, 255)'      // Ciano
            ];
            let colorIndex = 0;

            categorias.forEach(categoria => {
                const dataForCategoria = data.filter(item => item.categoria === categoria);

                datasets.push({
                    label: categoria,
                    data: anos.map(ano => {
                        const item = dataForCategoria.find(d => d.ano_censo === ano);
                        return item ? item.valor : 0;
                    }),
                    borderColor: colors[colorIndex % colors.length],
                    backgroundColor: colors[colorIndex % colors.length].replace('rgb', 'rgba').replace(')', ', 0.5)'),
                    borderWidth: 1,
                    tension: 0.1,
                    hidden: false
                });
                colorIndex++;
            });

            const ctx = document.getElementById('educacaoSuperiorPorCategoriaConcluintesChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: anos,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Concluintes por Categoria Administrativa (2014-2024)'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        },
                        datalabels: {
                            anchor: 'end',
                            align: 'end',
                            rotation: 90, // Vertical orientation
                            formatter: function(value) {
                                return value.toLocaleString(); // Format number for readability
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
                            },
                            stacked: false,
                            barPercentage: 0.8,
                            categoryPercentage: 0.7
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Quantidade de Concluintes'
                            },
                            beginAtZero: true,
                            stacked: false
                        }
                    }
                }
            });

            document.getElementById('exportEducacaoSuperiorPorCategoriaConcluintesBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Concluintes por Categoria");
                XLSX.writeFile(wb, "educacao_superior_por_categoria_concluintes.xlsx");
            });

        })
        .catch(error => console.error('Erro ao carregar dados do gráfico de concluintes por categoria administrativa:', error));
});




