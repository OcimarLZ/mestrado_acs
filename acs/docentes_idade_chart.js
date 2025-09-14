document.addEventListener('DOMContentLoaded', function() {
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('ERRO: Chart.js não está carregado!');
        return;
    }
    
    // Verificar se o canvas existe
    const canvas = document.getElementById('docentesIdadeChart');
    if (!canvas) {
        console.error('ERRO: Canvas docentesIdadeChart não encontrado!');
        return;
    }
    
     fetch('dados_docentes_idade.json') 
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                console.error('No data received for chart');
                return;
            }
            const anos = data.map(item => item.ano);

            const datasets = [
                { label: '0-29', data: data.map(item => item.idade_0_29), borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)', tension: 0.1 },
                { label: '30-34', data: data.map(item => item.idade_30_34), borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.5)', tension: 0.1 },
                { label: '35-39', data: data.map(item => item.idade_35_39), borderColor: 'rgb(255, 205, 86)', backgroundColor: 'rgba(255, 205, 86, 0.5)', tension: 0.1 },
                { label: '40-44', data: data.map(item => item.idade_40_44), borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)', tension: 0.1 },
                { label: '45-49', data: data.map(item => item.idade_45_49), borderColor: 'rgb(153, 102, 255)', backgroundColor: 'rgba(153, 102, 255, 0.5)', tension: 0.1 },
                { label: '50-54', data: data.map(item => item.idade_50_54), borderColor: 'rgb(255, 159, 64)', backgroundColor: 'rgba(255, 159, 64, 0.5)', tension: 0.1 },
                { label: '55-59', data: data.map(item => item.idade_55_59), borderColor: 'rgb(201, 203, 207)', backgroundColor: 'rgba(201, 203, 207, 0.5)', tension: 0.1 },
                { label: '60+', data: data.map(item => item.idade_60_mais), borderColor: 'rgb(255, 0, 0)', backgroundColor: 'rgba(255, 0, 0, 0.5)', tension: 0.1 }
            ];

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
                            text: 'Evolução da Faixa Etária dos Docentes em Chapecó (2014-2024)'
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
            document.getElementById('exportDocentesIdadeBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Docentes por Idade");
                XLSX.writeFile(wb, "docentes_por_idade.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de idade dos docentes:', error));
});




