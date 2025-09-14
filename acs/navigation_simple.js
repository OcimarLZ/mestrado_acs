// Sistema de navegação simplificado para debug
class SimpleNavigationManager {
    constructor() {
        console.log('SimpleNavigationManager inicializado');
        this.pages = {
            'ies-perfil': 'pages/ies-perfil.html',
            'discentes': 'pages/discentes.html',
            'meta12-pne': 'pages/meta12-pne.html',
            'populacao': 'pages/populacao.html'
        };
    }

    async loadPage(pageId) {
        console.log('=== CARREGANDO PÁGINA ===', pageId);
        
        // Verificar se a página existe
        if (!this.pages[pageId]) {
            console.error('Página não encontrada:', pageId);
            return;
        }
        
        // Obter elementos DOM
        const homeContent = document.getElementById('home-content');
        const pageContent = document.getElementById('page-content');
        const dynamicContent = document.getElementById('dynamic-content');
        const loadingSpinner = document.getElementById('loading-spinner');
        
        console.log('Elementos DOM:', {
            homeContent: !!homeContent,
            pageContent: !!pageContent,
            dynamicContent: !!dynamicContent,
            loadingSpinner: !!loadingSpinner
        });
        
        if (!homeContent || !pageContent || !dynamicContent || !loadingSpinner) {
            console.error('ERRO: Elementos DOM não encontrados!');
            return;
        }
        
        try {
            // Mostrar loading
            console.log('Mostrando loading...');
            homeContent.style.display = 'none';
            pageContent.style.display = 'block';
            loadingSpinner.style.display = 'block';
            dynamicContent.innerHTML = '';
            
            // Carregar conteúdo
            console.log('Fazendo fetch para:', this.pages[pageId]);
            const response = await fetch(this.pages[pageId]);
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const content = await response.text();
            console.log('Conteúdo carregado, tamanho:', content.length);
            
            // Mostrar conteúdo
            console.log('Exibindo conteúdo...');
            loadingSpinner.style.display = 'none';
            dynamicContent.innerHTML = content;
            
            console.log('=== PÁGINA CARREGADA COM SUCESSO ===');
            
        } catch (error) {
            console.error('ERRO ao carregar página:', error);
            loadingSpinner.style.display = 'none';
            dynamicContent.innerHTML = `
                <div class="alert alert-danger">
                    <h4>Erro ao carregar página</h4>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }
}

// Variável global
let simpleNavManager;

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando SimpleNavigationManager');
    simpleNavManager = new SimpleNavigationManager();
});

// Função global para teste
function loadPageSimple(pageId) {
    console.log('loadPageSimple chamada para:', pageId);
    if (simpleNavManager) {
        simpleNavManager.loadPage(pageId);
    } else {
        console.error('SimpleNavigationManager não inicializado');
        // Tentar novamente
        setTimeout(() => {
            if (simpleNavManager) {
                simpleNavManager.loadPage(pageId);
            } else {
                console.error('SimpleNavigationManager ainda não disponível');
            }
        }, 100);
    }
}

console.log('navigation_simple.js carregado!');




