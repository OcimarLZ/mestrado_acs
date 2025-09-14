document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('dinamicas-area-especifica-container');
    if (container) {
        // Tenta diferentes caminhos para o arquivo HTML
        const paths = [
            '/static/tabelas/dinamicas_area_especifica.html',
            '../static/tabelas/dinamicas_area_especifica.html',
            '../../static/tabelas/dinamicas_area_especifica.html'
        ];
        
        // Função para tentar o próximo caminho
        function tryNextPath(index) {
            if (index >= paths.length) {
                console.error('Não foi possível carregar dinamicas_area_especifica.html de nenhum caminho');
                container.innerHTML = '<p>Erro ao carregar o conteúdo.</p>';
                return;
            }
            
            fetch(paths[index])
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
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
                    console.warn(`Erro ao carregar de ${paths[index]}:`, error);
                    // Tenta o próximo caminho
                    tryNextPath(index + 1);
                });
        }
        
        // Inicia tentando o primeiro caminho
        tryNextPath(0);
    }
});




