document.addEventListener('DOMContentLoaded', function() {
     fetch('educacao_superior_por_organizacao_academica_combined.json') 
        .then(response => response.json())
        .then(data => {
            const anos = [...new Set(data.map(item => item.ano_censo))].sort();
            const tiposOrganizacao = [...new Set(data.map(item => item.tipo_organizacao))];

            const datasets = [];

            // Define a base color palette for organization types
            const baseColors = [
                'rgb(255, 99, 132)',    // Red
                'rgb(54, 162, 235)',    // Blue
                'rgb(75, 192, 192)',    // Green
                'rgb(153, 102, 255)'    // Purple
            ];

            // Define metric names and their corresponding properties
            const metrics = [
                { name: 'matriculas', label: 'Matrículas', dash: [], shade: 0 },
                { name: 'ingressos', label: 'Ingressos', dash: [], shade: 1 },
                { name: 'concluintes', label: 'Concluintes', dash: [], shade: 2 },
                { name: 'trancados', label: 'Trancados', dash: [5, 5], shade: 3 }, // Dashed
                { name: 'evadidos', label: 'Evadidos', dash: [1, 5], shade: 4 }    // Dotted
            ];

            // Function to get a shaded color
            function getShadedColor(baseColor, shadeIndex) {
                const [r, g, b] = baseColor.match(/\d+/g).map(Number);
                const factor = 1 - (shadeIndex * 0.15); // Adjust shade factor as needed
                return `rgb(${Math.round(r * factor)}, ${Math.round(g * factor)}, ${Math.round(b * factor)})`;
            }

            let orgColorIndex = 0;
            tiposOrganizacao.forEach(organizacao => {
                const dataForOrganizacao = data.filter(item => item.tipo_organizacao === organizacao);
                const baseColor = baseColors[orgColorIndex % baseColors.length];

                metrics.forEach(metric => {
                    const metricColor = getShadedColor(baseColor, metric.shade);
                    datasets.push({
                        label: `${organizacao} - ${metric.label}`,
                        data: anos.map(ano => {
                            const item = dataForOrganizacao.find(d => d.ano_censo === ano);
                            return item ? item[metric.name] : 0;
                        }),
                        borderColor: metricColor,
                        backgroundColor: metricColor.replace('rgb', 'rgba').replace(')', ', 0.2)'), // Lighter fill
                        tension: 0.3,
                        fill: false,
                        borderDash: metric.dash,
                        datalabels: {
                            align: 'top', // Adjust alignment for line charts
                            anchor: 'end',
                            rotation: 0 // Keep horizontal for line charts
                        }
                    });
                });
                orgColorIndex++;
            });

            const ctx = document.getElementById('educacaoSuperiorPorOrganizacaoAcademicaCombinedChart').getContext('2d');
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
                            text: 'Dinâmica da Educação Superior por Organização Acadêmica (2014-2024)'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        },
                        datalabels: {
                            display: false, // Hide by default due to clutter, can be enabled for specific datasets
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

            document.getElementById('exportEducacaoSuperiorPorOrganizacaoAcademicaCombinedBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Organizacao Academica");
                XLSX.writeFile(wb, "educacao_superior_por_organizacao_academica_combined.xlsx");
            });

        })
        .catch(error => console.error('Erro ao carregar dados do gráfico combinado por organização acadêmica:', error));
});




