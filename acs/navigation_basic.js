// Navegação ultra-básica para debug
console.log('=== NAVIGATION BASIC CARREGADO ===');

// Função simples para carregar páginas
function loadPageBasic(pageId) {
    console.log('=== FUNÇÃO CHAMADA ===', pageId);
    
    // Verificar se elementos existem
    var homeContent = document.getElementById('home-content');
    var pageContent = document.getElementById('page-content');
    var dynamicContent = document.getElementById('dynamic-content');
    var loadingSpinner = document.getElementById('loading-spinner');
    
    console.log('Elementos encontrados:', {
        home: homeContent ? 'SIM' : 'NÃO',
        page: pageContent ? 'SIM' : 'NÃO', 
        dynamic: dynamicContent ? 'SIM' : 'NÃO',
        loading: loadingSpinner ? 'SIM' : 'NÃO'
    });
    
    if (!homeContent || !pageContent || !dynamicContent || !loadingSpinner) {
        console.error('ERRO: Elementos DOM não encontrados!');
        alert('ERRO: Elementos DOM não encontrados!');
        return;
    }
    
    // Mostrar loading
    console.log('Escondendo home e mostrando loading...');
    homeContent.style.display = 'none';
    pageContent.style.display = 'block';
    loadingSpinner.style.display = 'block';
    dynamicContent.innerHTML = '';
    
    // Definir URLs das páginas
    var pages = {
        'ies-perfil': 'pages/ies-perfil.html',
        'discentes': 'pages/discentes.html',
        'meta12-pne': 'pages/meta12-pne.html',
        'populacao': 'pages/populacao.html'
    };
    
    if (!pages[pageId]) {
        console.error('Página não encontrada:', pageId);
        loadingSpinner.style.display = 'none';
        dynamicContent.innerHTML = '<div style="color: red;">Página não encontrada: ' + pageId + '</div>';
        return;
    }
    
    console.log('Fazendo fetch para:', pages[pageId]);
    
    // Usar XMLHttpRequest em vez de fetch para compatibilidade
    var xhr = new XMLHttpRequest();
    xhr.open('GET', pages[pageId], true);
    
    xhr.onreadystatechange = function() {
        console.log('XMLHttpRequest state:', xhr.readyState, 'status:', xhr.status);
        
        if (xhr.readyState === 4) {
            loadingSpinner.style.display = 'none';
            
            if (xhr.status === 200) {
                console.log('Conteúdo carregado com sucesso, tamanho:', xhr.responseText.length);
                dynamicContent.innerHTML = xhr.responseText;
                console.log('=== PÁGINA CARREGADA COM SUCESSO ===');
            } else {
                console.error('Erro HTTP:', xhr.status);
                dynamicContent.innerHTML = '<div style="color: red;">Erro ao carregar página: HTTP ' + xhr.status + '</div>';
            }
        }
    };
    
    xhr.onerror = function() {
        console.error('Erro de rede');
        loadingSpinner.style.display = 'none';
        dynamicContent.innerHTML = '<div style="color: red;">Erro de rede ao carregar página</div>';
    };
    
    xhr.send();
}

// Função para voltar ao home
function showHomeBasic() {
    console.log('=== MOSTRANDO HOME ===');
    var homeContent = document.getElementById('home-content');
    var pageContent = document.getElementById('page-content');
    
    if (homeContent && pageContent) {
        homeContent.style.display = 'block';
        pageContent.style.display = 'none';
        console.log('Home exibido');
    }
}

// Aguardar DOM carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('=== DOM CARREGADO ===');
    });
} else {
    console.log('=== DOM JÁ ESTAVA CARREGADO ===');
}

console.log('=== NAVIGATION BASIC FINALIZADO ===');




