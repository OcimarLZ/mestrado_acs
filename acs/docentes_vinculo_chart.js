document.addEventListener('DOMContentLoaded', function() {
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('ERRO: Chart.js não está carregado!');
        return;
    }
    
    // Verificar se o canvas existe
    const canvas = document.getElementById('docentesVinculoChart');
    if (!canvas) {
        console.error('ERRO: Canvas docentesVinculoChart não encontrado!');
        return;
    }
    
     fetch('dados_docentes_vinculo.json') 
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                console.error('No data received for chart');
                return;
            }
            const anos = data.map(item => item.ano);

            const datasets = [
                { label: 'Integral com Dedicação', data: data.map(item => item.integral_com_dedicacao), borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)', tension: 0.1 },
                { label: 'Integral sem Dedicação', data: data.map(item => item.integral_sem_dedicacao), borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.5)', tension: 0.1 },
                { label: 'Parcial', data: data.map(item => item.parcial), borderColor: 'rgb(255, 205, 86)', backgroundColor: 'rgba(255, 205, 86, 0.5)', tension: 0.1 },
                { label: 'Horista', data: data.map(item => item.horista), borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)', tension: 0.1 },
                { label: 'Dedicação não Definida', data: data.map(item => item.dedicacao_nao_definida), borderColor: 'rgb(153, 102, 255)', backgroundColor: 'rgba(153, 102, 255, 0.5)', tension: 0.1 }
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
                            text: 'Evolução do Vínculo Empregatício dos Docentes em Chapecó (2014-2024)'
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
            document.getElementById('exportDocentesVinculoBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Docentes por Vínculo");
                XLSX.writeFile(wb, "docentes_por_vinculo.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de vínculo dos docentes:', error));
});




