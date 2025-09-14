document.addEventListener('DOMContentLoaded', function() {
     fetch('dados_discentes_matriculados_raca.json') 
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('discentesMatriculadosRacaChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.anos,
                    datasets: [
                        {
                            label: 'Branca',
                            data: data.branca,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Parda',
                            data: data.parda,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Preta',
                            data: data.preta,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Indígena',
                            data: data.indigena,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Amarela',
                            data: data.amarela,
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Não declarada',
                            data: data.naodeclarada,
                            backgroundColor: 'rgba(201, 203, 207, 0.2)',
                            borderColor: 'rgba(201, 203, 207, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Matriculados por Raça/Cor'
                        }
                    }
                }
            });

            // Função para exportar para Excel
            document.getElementById('exportMatriculadosRacaToExcel').addEventListener('click', function() {
                const wb = XLSX.utils.book_new();
                const ws_data = [["Ano", "Branca", "Parda", "Preta", "Indígena", "Amarela", "Não declarada"]]; // Cabeçalhos

                data.anos.forEach((ano, index) => {
                    ws_data.push([
                        ano,
                        data.branca[index],
                        data.parda[index],
                        data.preta[index],
                        data.indigena[index],
                        data.amarela[index],
                        data.naodeclarada[index]
                    ]);
                });

                const ws = XLSX.utils.aoa_to_sheet(ws_data);
                XLSX.utils.book_append_sheet(wb, ws, "Matriculados por Raça");
                XLSX.writeFile(wb, 'matriculados_por_raca.xlsx');
            });
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));
});




