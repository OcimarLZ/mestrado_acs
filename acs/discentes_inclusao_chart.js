// Gráfico de Discentes Ingressantes A Partir de Políticas de Inclusão
fetch('dados_discentes_inclusao.json')
    .then(response => response.json())
    .then(data => {
        // Extrair anos e dados dos datasets
        const anos = data.anos;
        const apoioSocialData = data.datasets.APOIO_SOCIAL;
        const deficientesData = data.datasets.DEFICIENTES;
        const reservaVagasData = data.datasets.RESERVA_VAGAS;
        const reservaSocialData = data.datasets.RESERVA_SOCIAL;
        const reservaEtnicaData = data.datasets.RESERVA_ETNICA;

        // Definir cores para cada categoria
        const colors = {
            'APOIO_SOCIAL': '#FF6384',
            'DEFICIENTES': '#36A2EB',
            'RESERVA_VAGAS': '#FFCE56',
            'RESERVA_SOCIAL': '#4BC0C0',
            'RESERVA_ETNICA': '#9966FF'
        };

        // Preparar dados para o Chart.js
        const chartData = {
            labels: anos,
            datasets: [
                {
                    label: 'Apoio Social',
                    data: apoioSocialData,
                    backgroundColor: colors.APOIO_SOCIAL,
                    borderColor: colors.APOIO_SOCIAL,
                    borderWidth: 1
                },
                {
                    label: 'Deficientes',
                    data: deficientesData,
                    backgroundColor: colors.DEFICIENTES,
                    borderColor: colors.DEFICIENTES,
                    borderWidth: 1
                },
                {
                    label: 'Reserva de Vagas',
                    data: reservaVagasData,
                    backgroundColor: colors.RESERVA_VAGAS,
                    borderColor: colors.RESERVA_VAGAS,
                    borderWidth: 1
                },
                {
                    label: 'Reserva Social',
                    data: reservaSocialData,
                    backgroundColor: colors.RESERVA_SOCIAL,
                    borderColor: colors.RESERVA_SOCIAL,
                    borderWidth: 1
                },
                {
                    label: 'Reserva Étnica',
                    data: reservaEtnicaData,
                    backgroundColor: colors.RESERVA_ETNICA,
                    borderColor: colors.RESERVA_ETNICA,
                    borderWidth: 1
                }
            ]
        };

        // Configuração do gráfico
        const config = {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Discentes Ingressantes A Partir de Políticas de Inclusão'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Ano'
                        }
                    },
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Número de Ingressantes'
                        }
                    }
                }
            }
        };

        // Criar o gráfico
        const ctx = document.getElementById('discentesInclusaoChart').getContext('2d');
        new Chart(ctx, config);
    })
    .catch(error => {
        console.error('Erro ao carregar dados do gráfico de inclusão:', error);
    });