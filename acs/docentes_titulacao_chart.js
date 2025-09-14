document.addEventListener('DOMContentLoaded', function() {
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('ERRO: Chart.js não está carregado!');
        return;
    }
    
    // Verificar se o canvas existe
    const canvas = document.getElementById('docentesTitulacaoChart');
    if (!canvas) {
        console.error('ERRO: Canvas docentesTitulacaoChart não encontrado!');
        return;
    }
    
     fetch('dados_docentes_titulacao.json') 
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                console.error('No data received for chart');
                return;
            }
            const anos = data.map(item => item.ano);

            const datasets = [
                { label: 'Sem Graduação', data: data.map(item => item.sem_graduacao), borderColor: 'rgb(255, 99, 132)', backgroundColor: 'rgba(255, 99, 132, 0.5)', tension: 0.1 },
                { label: 'Graduação', data: data.map(item => item.graduacao), borderColor: 'rgb(54, 162, 235)', backgroundColor: 'rgba(54, 162, 235, 0.5)', tension: 0.1 },
                { label: 'Especialização', data: data.map(item => item.especializacao), borderColor: 'rgb(255, 205, 86)', backgroundColor: 'rgba(255, 205, 86, 0.5)', tension: 0.1 },
                { label: 'Mestrado', data: data.map(item => item.mestrado), borderColor: 'rgb(75, 192, 192)', backgroundColor: 'rgba(75, 192, 192, 0.5)', tension: 0.1 },
                { label: 'Doutorado', data: data.map(item => item.doutorado), borderColor: 'rgb(153, 102, 255)', backgroundColor: 'rgba(153, 102, 255, 0.5)', tension: 0.1 },
                { label: 'Titulação NDEF', data: data.map(item => item.titulacao_ndef), borderColor: 'rgb(255, 159, 64)', backgroundColor: 'rgba(255, 159, 64, 0.5)', tension: 0.1 }
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
                            text: 'Evolução da Titulação dos Docentes em Chapecó (2014-2024)'
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
            document.getElementById('exportDocentesTitulacaoBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Docentes por Titulação");
                XLSX.writeFile(wb, "docentes_por_titulacao.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de titulação dos docentes:', error));
});




