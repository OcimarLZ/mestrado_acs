// Dados populacionais por etnia - Chapecó (código 4204202)
// Baseado na consulta SQL fornecida

// Dados reais obtidos do banco INEP.db para Chapecó (código 4204202)
const dadosPopulacaoEtnia = {
    populacao: 254776, // pop_ajustada
    pop_branca: 176060,
    pop_parda: 65512,
    pop_preta: 10572,
    quilombolas: 0, // pop_quilombola + pop_quilombola_territorio
    indigenas: 4158, // pop_indigena + pop_indigena_territorio
    pop_amarela: 339
};

function calcularPercentual(valor, total) {
    return ((valor / total) * 100).toFixed(2);
}

function popularTabelaPopulacaoEtnia() {
    const tbody = document.getElementById('populacaoEtniaTableBody');
    const totalPopulacao = document.getElementById('totalPopulacao');
    
    if (!tbody || !totalPopulacao) {
        console.error('Elementos da tabela não encontrados');
        return;
    }
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    // Dados para a tabela (sem categoria 'Não definida' pois todas as etnias foram declaradas)
    const etnias = [
        { nome: 'Branca', populacao: dadosPopulacaoEtnia.pop_branca },
        { nome: 'Parda', populacao: dadosPopulacaoEtnia.pop_parda },
        { nome: 'Preta', populacao: dadosPopulacaoEtnia.pop_preta },
        { nome: 'Indígena', populacao: dadosPopulacaoEtnia.indigenas },
        { nome: 'Amarela', populacao: dadosPopulacaoEtnia.pop_amarela }
    ];
    
    // Adicionar Quilombola apenas se houver população
    if (dadosPopulacaoEtnia.quilombolas > 0) {
        etnias.push({ nome: 'Quilombola', populacao: dadosPopulacaoEtnia.quilombolas });
    }
    
    // Ordenar por população (maior para menor)
    etnias.sort((a, b) => b.populacao - a.populacao);
    
    // Adicionar linhas à tabela
    etnias.forEach(etnia => {
        const row = tbody.insertRow();
        const percentual = calcularPercentual(etnia.populacao, dadosPopulacaoEtnia.populacao);
        
        row.innerHTML = `
            <td><strong>${etnia.nome}</strong></td>
            <td>${etnia.populacao.toLocaleString('pt-BR')}</td>
            <td>${percentual}%</td>
        `;
    });
    
    // Atualizar total
    totalPopulacao.textContent = dadosPopulacaoEtnia.populacao.toLocaleString('pt-BR');
}

function exportPopulacaoEtniaToExcel() {
    if (typeof XLSX === 'undefined') {
        alert('Biblioteca XLSX não carregada. Não é possível exportar.');
        return;
    }
    
    // Preparar dados para exportação
    const dadosExport = [
        ['Etnia', 'População', 'Percentual (%)']
    ];
    
    // Dados para exportação (sem categoria 'Não definida' pois todas as etnias foram declaradas)
    const etnias = [
        { nome: 'Branca', populacao: dadosPopulacaoEtnia.pop_branca },
        { nome: 'Parda', populacao: dadosPopulacaoEtnia.pop_parda },
        { nome: 'Preta', populacao: dadosPopulacaoEtnia.pop_preta },
        { nome: 'Indígena', populacao: dadosPopulacaoEtnia.indigenas },
        { nome: 'Amarela', populacao: dadosPopulacaoEtnia.pop_amarela }
    ];
    
    // Adicionar Quilombola apenas se houver população
    if (dadosPopulacaoEtnia.quilombolas > 0) {
        etnias.push({ nome: 'Quilombola', populacao: dadosPopulacaoEtnia.quilombolas });
    }
    
    // Ordenar por população (maior para menor)
    etnias.sort((a, b) => b.populacao - a.populacao);
    
    etnias.forEach(etnia => {
        const percentual = calcularPercentual(etnia.populacao, dadosPopulacaoEtnia.populacao);
        dadosExport.push([etnia.nome, etnia.populacao, percentual + '%']);
    });
    
    // Adicionar linha de total
    dadosExport.push(['Total', dadosPopulacaoEtnia.populacao, '100.00%']);
    
    // Criar workbook e worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(dadosExport);
    
    // Adicionar worksheet ao workbook
    XLSX.utils.book_append_sheet(wb, ws, 'População por Etnia');
    
    // Salvar arquivo
    XLSX.writeFile(wb, 'populacao_etnia_chapeco.xlsx');
}

// Inicializar tabela quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    popularTabelaPopulacaoEtnia();
});