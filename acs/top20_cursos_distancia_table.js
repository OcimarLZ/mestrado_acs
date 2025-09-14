document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('top20CursosDistanciaTable');
    if (container) {
        fetch('../static/tabelas/top20_cursos_distancia.html')
            .then(response => response.text())
            .then(data => {
                container.innerHTML = data;
                // Apply formatting after content is loaded
                const table = container.querySelector('table');
                if (table) {
                    const tbody = table.querySelector('tbody');
                    if (tbody) {
                        Array.from(tbody.rows).forEach(row => {
                            Array.from(row.cells).forEach((cell, index) => {
                                // Apply to columns from index 2 to the end (Matrículas, Ingressos, Concluintes, Trancadas, Evadidos)
                                // 'Ano' (0) e 'Curso' (1) não são formatados
                                if (index >= 2) {
                                    cell.classList.add('text-end');
                                    const value = parseInt(cell.textContent.replace(/\./g, ''), 10); // Remove existing dots for parsing
                                    if (!isNaN(value)) {
                                        cell.textContent = value.toLocaleString('pt-BR'); // Format with thousands separator
                                    }
                                }
                            });
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching top20_cursos_distancia.html:', error);
                container.innerHTML = '<p>Error loading content.</p>';
            });
    }
});




