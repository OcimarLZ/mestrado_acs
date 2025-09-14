document.addEventListener('DOMContentLoaded', function() {
    // Verificar se Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não está disponível');
        return;
    }

    // Verificar se o canvas existe
    const canvas = document.getElementById('discentesConcluintesRacaChart');
    if (!canvas) {
        console.error('Canvas #discentesConcluintesRacaChart não encontrado');
        return;
    }

     fetch('dados_discentes_concluintes_raca.json') 
        .then(response => response.json())
        .then(data => {
            const anos = data.map(item => item.ano);
            const branca = data.map(item => item.branca);
            const parda = data.map(item => item.parda);
            const preta = data.map(item => item.preta);
            const indigena = data.map(item => item.indigena);
            const amarela = data.map(item => item.amarela);
            const naodeclarada = data.map(item => item.naodeclarada);

            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: anos,
                    datasets: [
                        {
                            label: 'Branca',
                            data: branca,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: false
                        },
                        {
                            label: 'Parda',
                            data: parda,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            fill: false
                        },
                        {
                            label: 'Preta',
                            data: preta,
                            borderColor: 'rgba(255, 206, 86, 1)',
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            fill: false
                        },
                        {
                            label: 'Indígena',
                            data: indigena,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: false
                        },
                        {
                            label: 'Amarela',
                            data: amarela,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            fill: false
                        },
                        {
                            label: 'Não Declarada',
                            data: naodeclarada,
                            borderColor: 'rgba(255, 159, 64, 1)',
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            fill: false
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Análise do perfil discente por raça e cor (concluintes) na educação de Chapecó'
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Ano do Censo'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Número de Concluintes'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Erro ao carregar os dados do gráfico:', error));
});




