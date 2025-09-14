document.addEventListener('DOMContentLoaded', function() {
     fetch('menores_ies_resumo.json') 
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('menoresIesResumoTableBody');
            if (!tableBody) {
                console.error('Elemento #menoresIesResumoTableBody não encontrado.');
                return;
            }

            // Limpa o corpo da tabela antes de adicionar novos dados
            tableBody.innerHTML = '';

            data.forEach(item => {
                const row = tableBody.insertRow();
                row.insertCell().textContent = item.nome_instituicao;
                row.insertCell().textContent = item.anos_ofertados;
                row.insertCell().textContent = item.media_matriculas_anual.toLocaleString(undefined, { maximumFractionDigits: 0 });
                row.insertCell().textContent = item.media_cursos_ofertados_anual.toLocaleString(undefined, { maximumFractionDigits: 1 });
            });
        })
        .catch(error => console.error('Erro ao carregar dados da tabela de resumo das menores IES:', error));
});




