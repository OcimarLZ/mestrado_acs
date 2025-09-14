// perspectiva_social_chart.js

document.addEventListener('DOMContentLoaded', function() {
     fetch('dados_perspectiva_social.json') 
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('perspectivaSocialChart').getContext('2d');
            
            // Adicionar cores aos datasets
            const colors = [
                'rgb(255, 99, 132)', // vermelho
                'rgb(54, 162, 235)', // azul
                'rgb(255, 206, 86)', // amarelo
                'rgb(75, 192, 192)', // verde
                'rgb(153, 102, 255)', // roxo
                'rgb(255, 159, 64)', // laranja
                'rgb(201, 203, 207)' // cinza
            ];
            
            data.datasets.forEach((dataset, index) => {
                dataset.borderColor = colors[index % colors.length];
                dataset.backgroundColor = 'transparent'; // Sem preenchimento
                dataset.pointBackgroundColor = colors[index % colors.length];
            });
            
            new Chart(ctx, {
                type: 'line',  // Pode mudar para 'bar' se preferir gráfico de barras
                data: {
                    labels: data.anos,
                    datasets: data.datasets
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Análise sobre as Variáveis da Perspectiva Social na Educação Superior de Chapecó'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false
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
                                text: 'Quantidade de Matrículas'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
            console.log('Gráfico de perspectiva social criado com sucesso');
        })
        .catch(error => console.error('Erro ao carregar dados de perspectiva social:', error));
});

// Função para exportar para Excel (chamada pelo botão no HTML)
function exportarPerspectivaSocialExcel() {
    window.location.href = '../static/tabelas/perspectiva_social.xlsx';
}




