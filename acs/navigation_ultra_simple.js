// Sistema de Navegação Ultra Simples
console.log('🚀 Navigation Ultra Simple carregado!');

// Função principal de navegação
function loadPage(pageId) {
    console.log('📄 loadPage chamado para:', pageId);
    
    // Mapeamento de páginas
    const pages = {
        'ies-perfil': 'pages/ies-perfil.html',
        'discentes': 'pages/discentes.html',
        'docentes-tecnicos': 'pages/docentes.html',
        'areas-conhecimento': 'pages/areas-conhecimento.html',
        'cursos-superiores': 'pages/cursos.html',
        'meta12-pne': 'pages/meta12-pne.html',
        'populacao': 'pages/populacao.html'
    };
    
    // Verificar se a página existe
    if (!pages[pageId]) {
        console.error('❌ Página não encontrada:', pageId);
        alert('Página não encontrada: ' + pageId);
        return;
    }
    
    // Obter elementos
    const homeContent = document.getElementById('home-content');
    const pageContent = document.getElementById('page-content');
    const dynamicContent = document.getElementById('dynamic-content');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    // Verificar se elementos existem
    if (!homeContent) {
        console.error('❌ Elemento home-content não encontrado');
        alert('ERRO: Elemento home-content não encontrado!');
        return;
    }
    
    if (!pageContent) {
        console.error('❌ Elemento page-content não encontrado');
        alert('ERRO: Elemento page-content não encontrado!');
        return;
    }
    
    if (!dynamicContent) {
        console.error('❌ Elemento dynamic-content não encontrado');
        alert('ERRO: Elemento dynamic-content não encontrado!');
        return;
    }
    
    if (!loadingSpinner) {
        console.error('❌ Elemento loading-spinner não encontrado');
        alert('ERRO: Elemento loading-spinner não encontrado!');
        return;
    }
    
    console.log('✅ Todos os elementos DOM encontrados');
    
    // Mostrar loading
    console.log('🔄 Mostrando loading...');
    homeContent.style.display = 'none';
    pageContent.style.display = 'block';
    loadingSpinner.style.display = 'block';
    dynamicContent.innerHTML = '';
    
    // Fazer requisição
    console.log('📡 Fazendo requisição para:', pages[pageId]);
    
    fetch(pages[pageId])
        .then(response => {
            console.log('📥 Resposta recebida:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return response.text();
        })
        .then(html => {
            console.log('✅ HTML recebido, tamanho:', html.length, 'caracteres');
            
            // Esconder loading e mostrar conteúdo
            loadingSpinner.style.display = 'none';
            dynamicContent.innerHTML = html;
            
            console.log('🎉 Página carregada com sucesso!');
            alert('✅ Página "' + pageId + '" carregada com sucesso!');
        })
        .catch(error => {
            console.error('❌ Erro ao carregar página:', error);
            
            loadingSpinner.style.display = 'none';
            dynamicContent.innerHTML = `
                <div class="alert alert-danger">
                    <h4>❌ Erro ao carregar a página</h4>
                    <p>Não foi possível carregar o conteúdo da página "${pageId}".</p>
                    <p><strong>Erro:</strong> ${error.message}</p>
                    <button class="btn btn-primary" onclick="loadPage('home')">Voltar ao Início</button>
                </div>
            `;
            
            alert('❌ ERRO: ' + error.message);
        });
}

// Função para voltar ao início
function showHome() {
    console.log('🏠 Voltando ao início...');
    
    const homeContent = document.getElementById('home-content');
    const pageContent = document.getElementById('page-content');
    
    if (homeContent && pageContent) {
        homeContent.style.display = 'block';
        pageContent.style.display = 'none';
        console.log('✅ Página inicial exibida');
    } else {
        console.error('❌ Elementos para mostrar home não encontrados');
        alert('ERRO: Não foi possível voltar ao início!');
    }
}

// Função especial para home
function loadHome() {
    showHome();
}

// Auto-inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM carregado - Sistema de navegação pronto!');
});

console.log('✅ Navigation Ultra Simple inicializado!');




