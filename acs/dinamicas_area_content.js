document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('dinamicas-area-container');
    if (container) {
        fetch('../static/tabelas/dinamicas_area.html')
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
                                // Apply to all columns except the first two (index 0 and 1)
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
                console.error('Error fetching dinamicas_area.html:', error);
                container.innerHTML = '<p>Error loading content.</p>';
            });
    }
});




