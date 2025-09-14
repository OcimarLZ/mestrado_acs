// Sistema de Navegação Corrigido
class NavigationManager {
    constructor() {
        console.log('NavigationManager inicializado!');
        this.pages = {
            'ies-perfil': 'pages/ies-perfil.html',
            'discentes': 'pages/discentes.html',
            'docentes-tecnicos': 'pages/docentes.html',
            'areas-conhecimento': 'pages/areas-conhecimento.html',
            'cursos-superiores': 'pages/cursos.html',
            'meta12-pne': 'pages/meta12-pne.html',
            'populacao': 'pages/populacao.html'
        };
    }

    async loadPage(pageId) {
        console.log('Carregando página:', pageId);
        
        // Verificar se a página existe
        if (!this.pages[pageId]) {
            console.error('Página não encontrada:', pageId);
            alert('Página não encontrada: ' + pageId);
            return;
        }

        // Obter elementos DOM
        const homeContent = document.getElementById('home-content');
        const pageContent = document.getElementById('page-content');
        const dynamicContent = document.getElementById('dynamic-content');
        const loadingSpinner = document.getElementById('loading-spinner');

        if (!homeContent || !pageContent || !dynamicContent || !loadingSpinner) {
            console.error('Elementos DOM não encontrados');
            alert('Erro: Elementos da página não encontrados!');
            return;
        }

        try {
            // Mostrar loading e esconder home
            homeContent.style.display = 'none';
            pageContent.style.display = 'block';
            loadingSpinner.style.display = 'block';
            dynamicContent.innerHTML = '';

            console.log('Fazendo requisição para:', this.pages[pageId]);

            // Fazer requisição usando fetch
            const response = await fetch(this.pages[pageId]);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            
            // Esconder loading e mostrar conteúdo
            loadingSpinner.style.display = 'none';
            dynamicContent.innerHTML = html;
            
            console.log('Página carregada com sucesso!');
            alert('Página "' + pageId + '" carregada com sucesso!');
            
            // Executar scripts se houver
            this.executeScripts(dynamicContent);
            
        } catch (error) {
            console.error('Erro ao carregar página:', error);
            loadingSpinner.style.display = 'none';
            dynamicContent.innerHTML = `
                <div class="alert alert-danger">
                    <h4>Erro ao carregar a página</h4>
                    <p>Não foi possível carregar o conteúdo da página "${pageId}".</p>
                    <p><strong>Erro:</strong> ${error.message}</p>
                </div>
            `;
            alert('Erro ao carregar página: ' + error.message);
        }
    }

    executeScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            if (script.src) {
                newScript.src = script.src;
            } else {
                newScript.textContent = script.textContent;
            }
            document.head.appendChild(newScript);
        });
    }

    showHome() {
        console.log('Mostrando página inicial');
        
        const homeContent = document.getElementById('home-content');
        const pageContent = document.getElementById('page-content');
        
        if (homeContent && pageContent) {
            homeContent.style.display = 'block';
            pageContent.style.display = 'none';
            console.log('Página inicial exibida');
        } else {
            console.error('Elementos para mostrar home não encontrados');
        }
    }
}

// Instância global
let navManager;

// Função global para ser chamada pelos botões
function loadPage(pageId) {
    console.log('loadPage chamado para:', pageId);
    if (navManager) {
        navManager.loadPage(pageId);
    } else {
        console.error('NavigationManager não inicializado');
        alert('Erro: Sistema de navegação não inicializado!');
    }
}

// Função para voltar ao início
function showHome() {
    console.log('showHome chamado');
    if (navManager) {
        navManager.showHome();
    } else {
        console.error('NavigationManager não inicializado');
    }
}

// Inicializar quando o DOM estiver pronto
function initNavigation() {
    console.log('Inicializando sistema de navegação...');
    navManager = new NavigationManager();
    console.log('Sistema de navegação inicializado!');
}

// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    initNavigation();
}




