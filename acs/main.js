document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM carregado. Iniciando busca por dados...");
    
    // Função para exportar dados para Excel
    function exportToExcel(data, filename) {
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
        XLSX.writeFile(workbook, filename);
    }

    console.log("Iniciando fetch para dados_ies.json");
    // Função para criar a primeira tabela de IES
     fetch('dados_ies.json') 
        .then(response => {
            console.log("Resposta do fetch para dados_ies.json:", response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dados recebidos de dados_ies.json:", data);
            const tableContainer = document.getElementById('table-ies-container');
            
            let table = '<table class="table table-striped table-bordered">'
            table += '<thead class="thead-dark"><tr><th>Nome da IES</th><th>Sigla</th><th>Categoria Administrativa</th><th>Modalidades de Ensino</th></tr></thead>';
            table += '<tbody>';

            data.forEach(ies => {
                table += `<tr>
                    <td>${ies.nome}</td>
                    <td>${ies.sigla}</td>
                    <td>${ies.categoria}</td>
                    <td>${ies.modalidades}</td>
                </tr>`;
            });

            table += '</tbody></table>';
            table += '<div class="text-center mt-2"><button id="exportTableIesBtn" class="btn btn-sm btn-outline-primary">Exportar para Excel</button></div>';
            tableContainer.innerHTML = table;
            
            // Configurar botão de exportação para Excel
            document.getElementById('exportTableIesBtn').addEventListener('click', function() {
                const datasets = [
                    ['Nome da IES', 'Sigla', 'Categoria Administrativa', 'Modalidades de Ensino']
                ];
                
                // Adicionar dados de cada IES
                data.forEach(ies => {
                    datasets.push([
                        ies.nome,
                        ies.sigla,
                        ies.categoria,
                        ies.modalidades
                    ]);
                });
                
                exportToExcel(datasets, 'ies_chapeco.xlsx');
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os dados das IES:', error);
            const tableContainer = document.getElementById('table-ies-container');
            tableContainer.innerHTML = '<p class="text-danger">Não foi possível carregar os dados das Instituições.</p>';
        });

    console.log("Iniciando fetch para dados_mantenedoras_ies.json");
    // Função para criar a tabela de mantenedoras e IES (NOVO)
    fetch('dados_mantenedoras_ies.json') 
        .then(response => {
            console.log("Resposta do fetch para dados_mantenedoras_ies.json:", response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dados recebidos de dados_mantenedoras_ies.json:", data);
            const tableContainer = document.getElementById('table-mantenedoras-ies-container');
            
            let table = '<table class="table table-striped table-bordered">';
            table += '<thead class="thead-dark"><tr><th>Mantenedora</th><th>IES</th></tr></thead>';
            table += '<tbody>';

            data.forEach(item => {
                table += `<tr>
                    <td>${item.mantenedora}</td>
                    <td>${item.ies.join(', ')}</td>
                </tr>`;
            });

            table += '</tbody></table>';
            table += '<div class="text-center mt-2"><button id="exportTableMantenedorasIesBtn" class="btn btn-sm btn-outline-primary">Exportar para Excel</button></div>';
            tableContainer.innerHTML = table;

            // Configurar botão de exportação para Excel
            document.getElementById('exportTableMantenedorasIesBtn').addEventListener('click', function() {
                const datasets = [
                    ['Mantenedora', 'IES']
                ];
                
                // Adicionar dados de cada mantenedora
                data.forEach(item => {
                    datasets.push([
                        item.mantenedora,
                        item.ies.join(', ')
                    ]);
                });
                
                exportToExcel(datasets, 'mantenedoras_ies_chapeco.xlsx');
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os dados das mantenedoras e IES:', error);
            const tableContainer = document.getElementById('table-mantenedoras-ies-container');
            tableContainer.innerHTML = '<p class="text-danger">Não foi possível carregar os dados das Mantenedoras e IES.</p>';
        });

    console.log("Iniciando fetch para dados_ranking_matriculas.json");
    // Função para criar o gráfico de ranking de matrículas (NOVO)
     fetch('dados_ranking_matriculas.json') 
        .then(response => {
            console.log("Resposta do fetch para dados_ranking_matriculas.json:", response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dados recebidos de dados_ranking_matriculas.json:", data);
            const ctx = document.getElementById('rankingMatriculasChart').getContext('2d');

            const labels = data.map(item => item.nome_ies);
            const matriculas2014 = data.map(item => item.matriculas_2014);
            const matriculas2019 = data.map(item => item.matriculas_2019); // Adicionado
            const matriculas2023 = data.map(item => item.matriculas_2023);

            const rankingMatriculasChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Matrículas 2014',
                            data: matriculas2014,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)', // Azul
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Matrículas 2019', // Adicionado
                            data: matriculas2019,    // Adicionado
                            backgroundColor: 'rgba(255, 206, 86, 0.6)', // Amarelo
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Matrículas 2023',
                            data: matriculas2023,
                            backgroundColor: 'rgba(255, 99, 132, 0.6)', // Vermelho
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    plugins: {
                        legend: {
                            display: true // Exibir legenda para diferenciar os anos
                        },
                        datalabels: {
                            rotation: -90,
                            anchor: 'start',
                            align: 'end',
                            offset: 4,
                            formatter: function(value) {
                                return value.toLocaleString(); // Formata o número com separador de milhar
                            },
                            color: '#363636',
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return value.toLocaleString(); // Formata o eixo Y
                                }
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels] // Habilita o plugin datalabels
            });

            // Configurar botão de exportação para Excel
            document.getElementById('exportRankingMatriculasBtn').addEventListener('click', function() {
                const datasets = [
                    ['IES', 'Matrículas 2014', 'Matrículas 2019', 'Matrículas 2023'] // Adicionado 2019
                ];
                
                data.forEach(item => {
                    datasets.push([
                        item.nome_ies,
                        item.matriculas_2014,
                        item.matriculas_2019, // Adicionado
                        item.matriculas_2023
                    ]);
                });
                
                exportToExcel(datasets, 'ranking_matriculas_chapeco.xlsx');
            });

            // Adicionar comentários ao gráfico de ranking de matrículas
            const rankingCommentaryElement = document.getElementById('ranking-commentary');
            if (rankingCommentaryElement) {
                try {
                    let commentary = '<h5 class="text-center">Análise do Ranking de Matrículas</h5>';
                    
                    if (data.length > 0) {
                        const topIes2014 = data.reduce((prev, current) => (prev.matriculas_2014 > current.matriculas_2014) ? prev : current);
                        const topIes2019 = data.reduce((prev, current) => (prev.matriculas_2019 > current.matriculas_2019) ? prev : current); // Adicionado
                        const topIes2023 = data.reduce((prev, current) => (prev.matriculas_2023 > current.matriculas_2023) ? prev : current);
                        
                        commentary += `<p class="text-justify mt-3">O ranking das 10 maiores IES em número de matrículas em Chapecó nos anos de 2014, 2019 e 2023 revela a predominância de instituições que conseguiram atrair um grande volume de estudantes. Em 2014, a IES com o maior número de matrículas foi <strong>${topIes2014.nome_ies}</strong>, com ${topIes2014.matriculas_2014.toLocaleString()} matrículas. Em 2019, a liderança foi de <strong>${topIes2019.nome_ies}</strong>, com ${topIes2019.matriculas_2019.toLocaleString()} matrículas. Já em 2023, a liderança foi de <strong>${topIes2023.nome_ies}</strong>, com ${topIes2023.matriculas_2023.toLocaleString()} matrículas.</p>`;

                        // Calcular crescimento médio das top 10
                        let totalMatriculas2014 = 0;
                        let totalMatriculas2019 = 0; // Adicionado
                        let totalMatriculas2023 = 0;
                        data.forEach(item => {
                            totalMatriculas2014 += item.matriculas_2014;
                            totalMatriculas2019 += item.matriculas_2019; // Adicionado
                            totalMatriculas2023 += item.matriculas_2023;
                        });

                        const crescimentoPercentual2014_2019 = totalMatriculas2014 > 0 ? 
                            ((totalMatriculas2019 - totalMatriculas2014) / totalMatriculas2014 * 100).toFixed(2) : 0;
                        const crescimentoPercentual2019_2023 = totalMatriculas2019 > 0 ? 
                            ((totalMatriculas2023 - totalMatriculas2019) / totalMatriculas2019 * 100).toFixed(2) : 0;
                        const crescimentoPercentual2014_2023 = totalMatriculas2014 > 0 ? 
                            ((totalMatriculas2023 - totalMatriculas2014) / totalMatriculas2014 * 100).toFixed(2) : 0;


                        commentary += `<p class="text-justify mt-3">No período de 2014 a 2019, as 10 principais IES apresentaram um crescimento de aproximadamente <strong>${crescimentoPercentual2014_2019}%</strong> no total de matrículas (de ${totalMatriculas2014.toLocaleString()} para ${totalMatriculas2019.toLocaleString()}). De 2019 a 2023, o crescimento foi de <strong>${crescimentoPercentual2019_2023}%</strong> (de ${totalMatriculas2019.toLocaleString()} para ${totalMatriculas2023.toLocaleString()}). O crescimento total de 2014 a 2023 foi de <strong>${crescimentoPercentual2014_2023}%</strong>.</p>`;

                        // Identificar IES com maior crescimento percentual (entre as top 10)
                        let maxGrowthPercent = -1;
                        let iesMaiorCrescimento = '';
                        data.forEach(item => {
                            if (item.matriculas_2014 > 0) {
                                const growth = ((item.matriculas_2023 - item.matriculas_2014) / item.matriculas_2014) * 100;
                                if (growth > maxGrowthPercent) {
                                    maxGrowthPercent = growth;
                                    iesMaiorCrescimento = item.nome_ies;
                                }
                            }
                        });

                        if (iesMaiorCrescimento) {
                            commentary += `<p class="text-justify mt-3">Entre as IES ranqueadas, <strong>${iesMaiorCrescimento}</strong> se destacou com o maior crescimento percentual de matrículas entre 2014 e 2023, atingindo um aumento de <strong>${maxGrowthPercent.toFixed(2)}%</strong> no período.</p>`;
                        }

                    } else {
                        commentary += '<p class="text-danger">Não há dados disponíveis para análise do ranking de matrículas.</p>';
                    }
                    
                    rankingCommentaryElement.innerHTML = commentary;
                } catch (commentaryError) {
                    console.error('Erro ao gerar comentários do ranking:', commentaryError);
                    rankingCommentaryElement.innerHTML = '<p class="text-danger">Erro ao gerar comentários do ranking.</p>';
                }
            }
        })
        .catch(error => {
            console.error('Erro ao carregar os dados do ranking de matrículas:', error);
            const chartContainer = document.getElementById('rankingMatriculasChart').parentNode;
            chartContainer.innerHTML = '<p class="text-danger">Não foi possível carregar os dados do ranking de matrículas.</p>';
        });

    console.log("Iniciando fetch para dados_ies_timeline.json");
    // Função para criar a tabela de timeline das IES
     fetch('dados_ies_timeline.json') 
        .then(response => {
            console.log("Resposta do fetch para dados_ies_timeline.json:", response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Dados recebidos de dados_ies_timeline.json:", data);
            const timelineContainer = document.getElementById('timeline-ies-container');
            
            let table = '<table class="table table-hover">';
            table += '<thead><tr><th>Nome da IES</th><th>Sigla</th><th>Início</th><th>Último Ano</th><th>Modalidades</th><th>Status</th></tr></thead>';
            table += '<tbody>';

            data.forEach(ies => {
                const statusClass = ies.status === 'Ativa' ? 'text-success' : 'text-danger';
                table += `<tr>
                    <td>${ies.nome}</td>
                    <td>${ies.sigla}</td>
                    <td>${ies.ano_inicio}</td>
                    <td>${ies.ano_fim}</td>
                    <td>${ies.modalidades}</td>
                    <td class="${statusClass}"><strong>${ies.status}</strong></td>
                </tr>`;
            });

            table += '</tbody></table>';
            table += '<div class="text-center mt-2"><button id="exportTimelineIesBtn" class="btn btn-sm btn-outline-primary">Exportar para Excel</button></div>';
            timelineContainer.innerHTML = table;
            
            // Configurar botão de exportação para Excel
            document.getElementById('exportTimelineIesBtn').addEventListener('click', function() {
                const datasets = [
                    ['Nome da IES', 'Sigla', 'Início', 'Último Ano', 'Modalidades', 'Status']
                ];
                
                // Adicionar dados de cada IES
                data.forEach(ies => {
                    datasets.push([
                        ies.nome,
                        ies.sigla,
                        ies.ano_inicio,
                        ies.ano_fim,
                        ies.modalidades,
                        ies.status
                    ]);
                });
                
                exportToExcel(datasets, 'timeline_ies_chapeco.xlsx');
            });

            // Lógica para criar o gráfico de evolução
            const years = Array.from({ length: 10 }, (_, i) => 2014 + i);
            const presencialData = [];
            const distanciaData = [];
            const totalData = [];

            years.forEach(year => {
                let presencialCount = 0;
                let distanciaCount = 0;
                let totalCount = 0;

                data.forEach(ies => {
                    if (year >= ies.ano_inicio && year <= ies.ano_fim) {
                        totalCount++;
                        if (ies.modalidades.includes('Presencial')) {
                            presencialCount++;
                        }
                        if (ies.modalidades.includes('A Distância')) {
                            distanciaCount++;
                        }
                    }
                });

                presencialData.push(presencialCount);
                distanciaData.push(distanciaCount);
                totalData.push(totalCount);
            });

            const ctx = document.getElementById('iesEvolutionChart').getContext('2d');
            const iesEvolutionChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: years,
                    datasets: [{
                        label: 'IES Presencial',
                        data: presencialData,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        fill: false,
                        tension: 0.1
                    }, {
                        label: 'IES a Distância',
                        data: distanciaData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        fill: false,
                        tension: 0.1
                    }, {
                        label: 'Total de IES',
                        data: totalData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        fill: false,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    animation: {
                        duration: 0 // Desativa as animações
                    },
                    plugins: {
                        datalabels: {
                            anchor: 'end',
                            align: 'top',
                            color: '#363636',
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
            
            // Adicionar comentários com números e percentuais ao gráfico
            const lastIndex = years.length - 1;
            const firstIndex = 0;
            
            // Calcular crescimento percentual
            const crescimentoTotalPercent = totalData[lastIndex] > 0 ? 
                Math.round(((totalData[lastIndex] - totalData[firstIndex]) / totalData[firstIndex]) * 100) : 0;
            const crescimentoPresencialPercent = presencialData[firstIndex] > 0 ? 
                Math.round(((presencialData[lastIndex] - presencialData[firstIndex]) / presencialData[firstIndex]) * 100) : 0;
            const crescimentoDistanciaPercent = distanciaData[firstIndex] > 0 ? 
                Math.round(((distanciaData[lastIndex] - distanciaData[firstIndex]) / distanciaData[firstIndex]) * 100) : 0;
            
            // Atualizar o comentário do gráfico com números e percentuais
            const commentaryElement = document.querySelector('.chart-commentary');
            if (commentaryElement) {
                const originalText = commentaryElement.innerHTML;
                const updatedText = originalText.replace(
                    'A análise do período entre 2014 e 2019 revela uma dinâmica de expansão acentuada da Educação a Distância (EAD) em Chapecó',
                    `A análise do período entre 2014 e 2019 revela uma dinâmica de expansão acentuada da Educação a Distância (EAD) em Chapecó, com um crescimento de ${crescimentoDistanciaPercent}% (de ${distanciaData[firstIndex]} para ${distanciaData[lastIndex]} instituições)`
                ).replace(
                    'o número de instituições presenciais se mantém relativamente estável',
                    `o número de instituições presenciais ${crescimentoPresencialPercent >= 0 ? 'aumentou' : 'diminuiu'} ${Math.abs(crescimentoPresencialPercent)}% (de ${presencialData[firstIndex]} para ${presencialData[lastIndex]} instituições)`
                ).replace(
                    'o salto expressivo na linha "IES a Distância" do gráfico a partir de 2017',
                    `o salto expressivo na linha "IES a Distância" do gráfico a partir de 2017, quando havia ${distanciaData[years.indexOf(2017)]} instituições, chegando a ${distanciaData[lastIndex]} em ${years[lastIndex]}`
                );
                commentaryElement.innerHTML = updatedText;
            }
            
            // Configurar botão de exportação para Excel
            document.getElementById('exportIesEvolutionBtn').addEventListener('click', function() {
                const labels = years;
                const datasets = [
                    ['Ano', 'IES Presencial', 'IES a Distância', 'Total de IES']
                ];
                
                // Adicionar dados para cada ano
                for (let i = 0; i < labels.length; i++) {
                    datasets.push([
                        labels[i],
                        presencialData[i],
                        distanciaData[i],
                        totalData[i]
                    ]);
                }
                
                exportToExcel(datasets, 'evolucao_ies_chapeco.xlsx');
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os dados da timeline das IES:', error);
            const timelineContainer = document.getElementById('timeline-ies-container');
            timelineContainer.innerHTML = '<p class="text-danger">Não foi possível carregar os dados da linha do tempo.</p>';
        });

    console.log("Iniciando fetch para dados_evolucao_categorias.json");
    // Fetch and create the category evolution line chart
     fetch('dados_evolucao_categorias.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const backgroundColors = [
                'rgba(78, 115, 223, 1)', 'rgba(28, 200, 138, 1)', 'rgba(54, 185, 204, 1)', 
                'rgba(246, 194, 62, 1)', 'rgba(231, 74, 59, 1)', 'rgba(133, 135, 150, 1)',
                'rgba(253, 126, 20, 1)', 'rgba(102, 16, 242, 1)', 'rgba(232, 62, 140, 1)'
            ];

            // Assign colors to each dataset
            data.datasets.forEach((dataset, index) => {
                dataset.borderColor = backgroundColors[index % backgroundColors.length];
                dataset.backgroundColor = `${backgroundColors[index % backgroundColors.length]}1a`;
                dataset.fill = false;
                dataset.tension = 0.1;
            });

            const ctx = document.getElementById('categoryEvolutionChart').getContext('2d');
            const categoryEvolutionChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: data.datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    animation: {
                        duration: 0 // Desativa as animações
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        datalabels: {
                           display: false // Disable datalabels for this chart to avoid clutter
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1 // Ensure Y-axis increments by whole numbers
                            }
                        }
                    }
                }
            });
            
            // Adicionar comentários com números e percentuais ao gráfico de categorias
            const lastIndex = data.labels.length - 1;
            const firstIndex = 0;
            
            // Encontrar a categoria com maior crescimento
            let maxGrowthCategory = '';
            let maxGrowthPercent = 0;
            let maxGrowthAbsolute = 0;
            
            // Calcular o total de IES no primeiro e último ano
            let totalFirst = 0;
            let totalLast = 0;
            
            data.datasets.forEach(ds => {
                totalFirst += ds.data[firstIndex];
                totalLast += ds.data[lastIndex];
                
                const growthAbsolute = ds.data[lastIndex] - ds.data[firstIndex];
                const growthPercent = ds.data[firstIndex] > 0 ? 
                    Math.round((growthAbsolute / ds.data[firstIndex]) * 100) : 0;
                    
                if (growthAbsolute > maxGrowthAbsolute) {
                    maxGrowthCategory = ds.label;
                    maxGrowthPercent = growthPercent;
                    maxGrowthAbsolute = growthAbsolute;
                }
            });
            
            // Calcular percentuais de participação no último ano
            const privateWithProfitLast = data.datasets.find(ds => ds.label === 'Privada com fins lucrativos')?.data[lastIndex] || 0;
            const privateWithProfitPercent = Math.round((privateWithProfitLast / totalLast) * 100);
            
            const privateNonProfitLast = data.datasets.find(ds => ds.label === 'Privada sem fins lucrativos')?.data[lastIndex] || 0;
            const privateNonProfitPercent = Math.round((privateNonProfitLast / totalLast) * 100);
            
            const publicFederalLast = data.datasets.find(ds => ds.label === 'Pública Federal')?.data[lastIndex] || 0;
            const publicFederalPercent = Math.round((publicFederalLast / totalLast) * 100);
            
            const publicStateLast = data.datasets.find(ds => ds.label === 'Pública Estadual')?.data[lastIndex] || 0;
            const publicStatePercent = Math.round((publicStateLast / totalLast) * 100);
            
            // Atualizar o comentário do gráfico com números e percentuais
            const commentaryElements = document.querySelectorAll('.chart-commentary');
            if (commentaryElements && commentaryElements.length > 1) {
                const categoryCommentary = commentaryElements[1];
                const originalText = categoryCommentary.innerHTML;
                
                const updatedText = originalText.replace(
                    'A evolução das Instituições de Ensino Superior (IES) em Chapecó, detalhada por categoria administrativa entre 2014 e 2023, serve como um microcosmo das profundas transformações na política educacional brasileira no período.',
                    `A evolução das Instituições de Ensino Superior (IES) em Chapecó, detalhada por categoria administrativa entre 2014 e 2023, serve como um microcosmo das profundas transformações na política educacional brasileira no período. Em ${data.labels[lastIndex]}, as IES privadas com fins lucrativos representam ${privateWithProfitPercent}% (${privateWithProfitLast} instituições) do total, enquanto as públicas federais e estaduais somam apenas ${publicFederalPercent + publicStatePercent}% (${publicFederalLast + publicStateLast} instituições).`
                ).replace(
                    'uma expansão massiva da categoria "Privada com fins lucrativos" em detrimento de uma estagnação das IES públicas (Federais e Estaduais)',
                    `uma expansão massiva da categoria "Privada com fins lucrativos" (crescimento de ${maxGrowthPercent}%, de ${data.datasets.find(ds => ds.label === maxGrowthCategory)?.data[firstIndex]} para ${data.datasets.find(ds => ds.label === maxGrowthCategory)?.data[lastIndex]} instituições) em detrimento de uma estagnação das IES públicas (Federais e Estaduais)`
                );
                
                categoryCommentary.innerHTML = updatedText;
            }
            
            // Configurar botão de exportação para Excel
            document.getElementById('exportCategoryEvolutionBtn').addEventListener('click', function() {
                const labels = data.labels;
                const datasets = [
                    ['Ano', ...data.datasets.map(ds => ds.label)]
                ];
                
                // Adicionar dados para cada ano
                for (let i = 0; i < labels.length; i++) {
                    const rowData = [labels[i]];
                    data.datasets.forEach(ds => {
                        rowData.push(ds.data[i]);
                    });
                    datasets.push(rowData);
                }
                
                exportToExcel(datasets, 'evolucao_ies_por_categoria_chapeco.xlsx');
            });
        })
        .catch(error => {
            console.error('Erro ao carregar dados para o gráfico de evolução de categorias:', error);
            const container = document.getElementById('categoryEvolutionChart').parentNode;
            container.innerHTML = '<p class="text-danger text-center">Não foi possível carregar os dados do gráfico.</p>';
        });

    console.log("Iniciando fetch para dados_evolucao_org_academica.json");
    // Fetch and create the organization evolution line chart
     fetch('dados_evolucao_org_academica.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const backgroundColors = [
                'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
                'rgba(199, 199, 199, 1)', 'rgba(83, 102, 255, 1)', 'rgba(100, 100, 100, 1)'
            ];

            data.datasets.forEach((dataset, index) => {
                dataset.borderColor = backgroundColors[index % backgroundColors.length];
                dataset.backgroundColor = `${backgroundColors[index % backgroundColors.length]}1a`;
                dataset.fill = false;
                dataset.tension = 0.1;
            });

            const ctx = document.getElementById('orgAcademicaEvolutionChart').getContext('2d');
            const orgAcademicaEvolutionChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.labels,
                    datasets: data.datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    aspectRatio: 2,
                    animation: {
                        duration: 0 // Desativa as animações
                    },
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        datalabels: {
                           display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
            
            // Adicionar comentários com números e percentuais ao gráfico de organização acadêmica
            const lastIndex = data.labels.length - 1;
            const firstIndex = 0;
            
            // Calcular crescimentos percentuais e valores absolutos
            const centroUnivData = data.datasets.find(ds => ds.label === 'Centro Universitário');
            const centroUnivGrowthPercent = centroUnivData && centroUnivData.data[firstIndex] > 0 ?
                Math.round(((centroUnivData.data[lastIndex] - centroUnivData.data[firstIndex]) / centroUnivData.data[firstIndex]) * 100) : 0;
            
            const faculdadeData = data.datasets.find(ds => ds.label === 'Faculdade');
            const faculdadeGrowthPercent = faculdadeData && faculdadeData.data[firstIndex] > 0 ?
                Math.round(((faculdadeData.data[lastIndex] - faculdadeData.data[firstIndex]) / faculdadeData.data[firstIndex]) * 100) : 0;
            
            const universidadeData = data.datasets.find(ds => ds.label === 'Universidade');
            const universidadeGrowthPercent = universidadeData && universidadeData.data[firstIndex] > 0 ?
                Math.round(((universidadeData.data[lastIndex] - universidadeData.data[firstIndex]) / universidadeData.data[firstIndex]) * 100) : 0;
            
            // Calcular o total de IES no último ano
            let totalLast = 0;
            data.datasets.forEach(ds => {
                totalLast += ds.data[lastIndex];
            });
            
            // Calcular percentuais de participação no último ano
            const centroUnivPercent = centroUnivData ? Math.round((centroUnivData.data[lastIndex] / totalLast) * 100) : 0;
            const faculdadePercent = faculdadeData ? Math.round((faculdadeData.data[lastIndex] / totalLast) * 100) : 0;
            const universidadePercent = universidadeData ? Math.round((universidadeData.data[lastIndex] / totalLast) * 100) : 0;
            
            // Atualizar o comentário do gráfico com números e percentuais
            const commentaryElements = document.querySelectorAll('.chart-commentary');
            if (commentaryElements && commentaryElements.length > 2) {
                const orgAcadCommentary = commentaryElements[2];
                const originalText = orgAcadCommentary.innerHTML;
                
                const updatedText = originalText.replace(
                    'A análise da evolução das IES por tipo de organização acadêmica em Chapecó revela tendências significativas sobre a configuração do ensino superior na região.',
                    `A análise da evolução das IES por tipo de organização acadêmica em Chapecó revela tendências significativas sobre a configuração do ensino superior na região. Em ${data.labels[lastIndex]}, os Centros Universitários representam ${centroUnivPercent}% (${centroUnivData?.data[lastIndex] || 0} instituições), as Faculdades ${faculdadePercent}% (${faculdadeData?.data[lastIndex] || 0} instituições) e as Universidades ${universidadePercent}% (${universidadeData?.data[lastIndex] || 0} instituições) do total.`
                ).replace(
                    'Observa-se uma predominância crescente de Faculdades, especialmente a partir de 2017',
                    `Observa-se uma predominância crescente de Centros Universitários, com impressionante crescimento de ${centroUnivGrowthPercent}% (de ${centroUnivData?.data[firstIndex] || 0} para ${centroUnivData?.data[lastIndex] || 0} instituições), especialmente a partir de 2017`
                ).replace(
                    'As Universidades, que exigem a indissociabilidade entre ensino, pesquisa e extensão, além de um terço do corpo docente em regime de tempo integral, mantiveram-se em número estável ou com leve declínio no período.',
                    `As Universidades, que exigem a indissociabilidade entre ensino, pesquisa e extensão, além de um terço do corpo docente em regime de tempo integral, ${universidadeGrowthPercent >= 0 ? 'cresceram' : 'tiveram declínio de'} ${Math.abs(universidadeGrowthPercent)}% no período (de ${universidadeData?.data[firstIndex] || 0} para ${universidadeData?.data[lastIndex] || 0} instituições).`
                );
                
                orgAcadCommentary.innerHTML = updatedText;
            }
            
            // Configurar botão de exportação para Excel
            document.getElementById('exportOrgAcademicaEvolutionBtn').addEventListener('click', function() {
                const labels = data.labels;
                const datasets = [
                    ['Ano', ...data.datasets.map(ds => ds.label)]
                ];
                
                // Adicionar dados para cada ano
                for (let i = 0; i < labels.length; i++) {
                    const rowData = [labels[i]];
                    data.datasets.forEach(ds => {
                        rowData.push(ds.data[i]);
                    });
                    datasets.push(rowData);
                }
                
                exportToExcel(datasets, 'evolucao_ies_por_org_academica_chapeco.xlsx');
            });
        })
        .catch(error => {
            console.error('Erro ao carregar dados para o gráfico de evolução por organização acadêmica:', error);
            const container = document.getElementById('orgAcademicaEvolutionChart').parentNode;
            container.innerHTML = '<p class="text-danger text-center">Não foi possível carregar os dados do gráfico.</p>';
        });
});




