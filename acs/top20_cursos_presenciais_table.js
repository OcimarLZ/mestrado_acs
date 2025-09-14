document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('top20CursosPresenciaisTable');
    if (container) {
        fetch('../static/tabelas/top20_cursos_presenciais.html')
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
                console.error('Error fetching top20_cursos_presenciais.html:', error);
                container.innerHTML = '<p>Error loading content.</p>';
            });
    }
});

// Exportar para Excel
document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.getElementById('exportTop20CursosPresenciaisBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            fetch('../static/tabelas/top20_cursos_presenciais.xlsx')
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'top20_cursos_presenciais.xlsx';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
                .catch(error => console.error('Erro ao baixar o Excel:', error));
        });
    }
});




