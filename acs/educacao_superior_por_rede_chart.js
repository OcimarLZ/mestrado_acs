document.addEventListener('DOMContentLoaded', function() {
     fetch('educacao_superior_por_rede.json') 
        .then(response => response.json())
        .then(data => {
            const anos = [...new Set(data.map(item => item.ano_censo))].sort(); // Obter anos únicos e ordenar
            const tiposRede = [...new Set(data.map(item => item.tipo_rede))]; // Obter tipos de rede únicos

            const datasets = [];

            // Paleta de cores para garantir contraste
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

            // Para cada tipo de rede, criar um dataset para Matrículas, Ingressos, Concluintes, Trancadas, Evadidos
            tiposRede.forEach(rede => {
                const dataForRede = data.filter(item => item.tipo_rede === rede);
                const isPublica = rede === 'Pública'; // Verifica se é rede Pública

                // Propriedade borderDash para linhas pontilhadas
                const borderDash = isPublica ? [5, 5] : []; // [tamanho do traço, tamanho do espaço]

                datasets.push({
                    label: `${rede} - Matrículas`,
                    data: anos.map(ano => {
                        const item = dataForRede.find(d => d.ano_censo === ano);
                        return item ? item.matriculas : 0;
                    }),
                    borderColor: colors[colorIndex % colors.length],
                    backgroundColor: colors[colorIndex % colors.length].replace('rgb', 'rgba').replace(')', ', 0.5)'), // Usar uma cor sólida semi-transparente
                    borderWidth: 1, // Adicionar largura da borda
                    tension: 0.1,
                    borderDash: borderDash, // Aplica o estilo de linha
                    hidden: false // Mostrar por padrão
                });
                colorIndex++; // Avança para a próxima cor

                datasets.push({
                    label: `${rede} - Ingressos`,
                    data: anos.map(ano => {
                        const item = dataForRede.find(d => d.ano_censo === ano);
                        return item ? item.ingressos : 0;
                    }),
                    borderColor: colors[colorIndex % colors.length],
                    backgroundColor: colors[colorIndex % colors.length].replace('rgb', 'rgba').replace(')', ', 0.5)'), // Usar uma cor sólida semi-transparente
                    borderWidth: 1, // Adicionar largura da borda
                    tension: 0.1,
                    borderDash: borderDash, // Aplica o estilo de linha
                    hidden: false // Mostrar por padrão
                });
                colorIndex++;

                datasets.push({
                    label: `${rede} - Concluintes`,
                    data: anos.map(ano => {
                        const item = dataForRede.find(d => d.ano_censo === ano);
                        return item ? item.concluintes : 0;
                    }),
                    borderColor: colors[colorIndex % colors.length],
                    backgroundColor: colors[colorIndex % colors.length].replace('rgb', 'rgba').replace(')', ', 0.5)'), // Usar uma cor sólida semi-transparente
                    borderWidth: 1, // Adicionar largura da borda
                    tension: 0.1,
                    borderDash: borderDash, // Aplica o estilo de linha
                    hidden: false // Mostrar por padrão
                });
                colorIndex++;

                datasets.push({
                    label: `${rede} - Trancadas`,
                    data: anos.map(ano => {
                        const item = dataForRede.find(d => d.ano_censo === ano);
                        return item ? item.trancadas : 0;
                    }),
                    borderColor: colors[colorIndex % colors.length],
                    backgroundColor: colors[colorIndex % colors.length].replace('rgb', 'rgba').replace(')', ', 0.5)'), // Usar uma cor sólida semi-transparente
                    borderWidth: 1, // Adicionar largura da borda
                    tension: 0.1,
                    borderDash: borderDash, // Aplica o estilo de linha
                    hidden: false // Mostrar por padrão
                });
                colorIndex++;

                datasets.push({
                    label: `${rede} - Evadidos`,
                    data: anos.map(ano => {
                        const item = dataForRede.find(d => d.ano_censo === ano);
                        return item ? item.evadidos : 0;
                    }),
                    borderColor: colors[colorIndex % colors.length],
                    backgroundColor: colors[colorIndex % colors.length].replace('rgb', 'rgba').replace(')', ', 0.5)'), // Usar uma cor sólida semi-transparente
                    borderWidth: 1, // Adicionar largura da borda
                    tension: 0.1,
                    borderDash: borderDash, // Aplica o estilo de linha
                    hidden: false // Mostrar por padrão
                });
                colorIndex++;
            });

            const ctx = document.getElementById('educacaoSuperiorPorRedeChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar', // Gráfico de barras
                data: {
                    labels: anos,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Números da Educação Superior em Chapecó sobre a Perspectiva da Rede de Educação'
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
                            },
                            stacked: false, // Para barras agrupadas por ano
                            barPercentage: 0.8, // Largura das barras (80% do espaço disponível)
                            categoryPercentage: 0.7 // Espaçamento entre grupos de barras (70% do espaço disponível)
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Quantidade'
                            },
                            beginAtZero: true,
                            stacked: false // Para barras agrupadas por ano
                        }
                    }
                }
            });

            // Exportar para Excel
            document.getElementById('exportEducacaoSuperiorPorRedeBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Educacao por Rede");
                XLSX.writeFile(wb, "educacao_superior_por_rede.xlsx");
            });

        })
        .catch(error => console.error('Erro ao carregar dados do gráfico de educação superior por rede:', error));
});




