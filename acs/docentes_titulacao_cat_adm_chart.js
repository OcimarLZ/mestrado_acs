
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('ERRO: Chart.js não está carregado!');
        return;
    }
    
    // Verificar se o canvas existe
    const canvas = document.getElementById('docentesTitulacaoCatAdmChart');
    if (!canvas) {
        console.error('ERRO: Canvas docentesTitulacaoCatAdmChart não encontrado!');
        return;
    }
    
     fetch('dados_docentes_titulacao_cat_adm.json') 
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                console.error('No data received for chart');
                return;
            }
            const anos = [...new Set(data.map(item => item.ano))].sort();
            
            const colors = [
                'rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 
                'rgb(153, 102, 255)', 'rgb(255, 159, 64)', 'rgb(201, 203, 207)', 'rgb(255, 0, 0)',
                'rgb(0, 255, 0)', 'rgb(0, 0, 255)', 'rgb(255, 255, 0)', 'rgb(0, 255, 255)', 'rgb(255, 0, 255)'
            ];
            let colorIndex = 0;

            const datasets = [];

            const categories = ["Especial", "Privada com fins lucrativos", "Privada sem fins lucrativos", "Pública Federal"];
            const degrees = ["sem_graduacao", "graduacao", "especializacao", "mestrado", "doutorado"];

            categories.forEach(category => {
                degrees.forEach(degree => {
                    const dataForCombination = data.filter(item => item.categoria_adm === category);
                    const lineData = anos.map(ano => {
                        const item = dataForCombination.find(d => d.ano === ano);
                        return item ? item[degree] : 0;
                    });

                    if (lineData.some(d => d > 0)) { // Only add dataset if there is data
                        datasets.push({
                            label: `${category} - ${degree.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
                            data: lineData,
                            borderColor: colors[colorIndex % colors.length],
                            backgroundColor: colors[colorIndex % colors.length],
                            tension: 0.1
                        });
                        colorIndex++;
                    }
                });
            });

            const ctx = canvas.getContext('2d');
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
                            text: 'Evolução da Titulação dos Docentes por Categoria Administrativa (2014-2024)'
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
            document.getElementById('exportDocentesTitulacaoCatAdmBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Docentes Titulação por Cat Adm");
                XLSX.writeFile(wb, "docentes_titulacao_cat_adm.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de titulação por categoria administrativa:', error));
});




