
document.addEventListener('DOMContentLoaded', function() {
     fetch('dados_docentes_geral.json') 
        .then(response => response.json())
        .then(data => {
            const anos = data.map(item => item.ano);

            const datasets = [
                {
                    label: 'Total de Docentes',
                    data: data.map(item => item.total_docentes),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Docentes em Exercício',
                    data: data.map(item => item.docentes_em_exercicio),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Docentes Afastados',
                    data: data.map(item => item.docentes_afastados),
                    borderColor: 'rgb(255, 205, 86)',
                    backgroundColor: 'rgba(255, 205, 86, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Docentes Femininos',
                    data: data.map(item => item.docentes_femininos),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Docentes Masculinos',
                    data: data.map(item => item.docentes_masculinos),
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    tension: 0.1
                }
            ];

            const ctx = document.getElementById('docentesGeralChart').getContext('2d');
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
                            text: 'Evolução Geral dos Docentes em Chapecó (2014-2024)'
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
            document.getElementById('exportDocentesGeralBtn').addEventListener('click', function() {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Docentes Geral");
                XLSX.writeFile(wb, "docentes_geral.xlsx");
            });
        })
        .catch(error => console.error('Erro ao carregar dados para o gráfico de docentes geral:', error));
});




