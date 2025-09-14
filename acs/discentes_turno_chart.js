document.addEventListener('DOMContentLoaded', function() {
    fetch('dados_discentes_turno.json')
        .then(response => response.json())
        .then(data => {
            const anos = data.anos;

            const datasets = [
                {
                    label: 'Ingressantes Diurno',
                    data: data.ingressantes_diurno,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Ingressantes Noturno',
                    data: data.ingressantes_noturno,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Concluintes Diurno',
                    data: data.concluintes_diurno,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Concluintes Noturno',
                    data: data.concluintes_noturno,
                    borderColor: 'rgb(255, 205, 86)',
                    backgroundColor: 'rgba(255, 205, 86, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Matrículas Diurno',
                    data: data.matriculas_diurno,
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.5)',
                    tension: 0.1
                },
                {
                    label: 'Matrículas Noturno',
                    data: data.matriculas_noturno,
                    borderColor: 'rgb(255, 159, 64)',
                    backgroundColor: 'rgba(255, 159, 64, 0.5)',
                    tension: 0.1
                }
            ];

            const ctx = document.getElementById('discentesTurnoChart').getContext('2d');
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
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Número de Discentes'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Ano'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar dados:', error);
        });
});