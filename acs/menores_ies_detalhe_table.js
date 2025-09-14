document.addEventListener('DOMContentLoaded', function() {
     fetch('menores_ies_detalhe.json') 
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('menoresIesDetalheTableBody');
            if (!tableBody) {
                console.error('Elemento #menoresIesDetalheTableBody não encontrado.');
                return;
            }

            tableBody.innerHTML = ''; // Clear existing content

            let currentInstitution = '';
            data.forEach(item => {
                if (item.nome_instituicao !== currentInstitution) {
                    // Add a row for the institution name if it's a new institution
                    let instituicaoRow = tableBody.insertRow();
                    instituicaoRow.className = 'table-primary'; // Style to highlight institution name
                    let instituicaoCell = instituicaoRow.insertCell();
                    instituicaoCell.colSpan = 7; // Span all columns (Institution + 6 data columns)
                    instituicaoCell.textContent = item.nome_instituicao;
                    currentInstitution = item.nome_instituicao;
                }

                // Add data row for the current year
                const row = tableBody.insertRow();
                row.insertCell().textContent = ''; // Empty cell for institution name column
                row.insertCell().textContent = item.ano_censo;
                row.insertCell().textContent = item.matriculas.toLocaleString();
                row.insertCell().textContent = item.ingressos.toLocaleString();
                row.insertCell().textContent = item.concluintes.toLocaleString();
                row.insertCell().textContent = item.trancados.toLocaleString();
                row.insertCell().textContent = item.evadidos.toLocaleString();
            });
        })
        .catch(error => console.error('Erro ao carregar dados da tabela de detalhe das menores IES:', error));

    // Add Excel export button logic
    document.getElementById('exportMenoresIesDetalheBtn').addEventListener('click', function() {
         fetch('menores_ies_detalhe.json') 
            .then(response => response.json())
            .then(data => {
                const ws = XLSX.utils.json_to_sheet(data);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Menores IES Detalhe");
                XLSX.writeFile(wb, "menores_ies_detalhe.xlsx");
            })
            .catch(error => console.error('Erro ao exportar dados da tabela de detalhe das menores IES para Excel:', error));
    });
});




