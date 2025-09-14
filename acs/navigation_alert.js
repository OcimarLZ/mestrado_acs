// Navigation Manager com Alerts para Debug
class AlertNavigationManager {
    constructor() {
        alert('NavigationManager inicializado!');
        this.pages = {
            'ies-perfil': 'pages/ies-perfil.html',
            'discentes': 'pages/discentes.html',
            'docentes': 'pages/docentes.html',
            'cursos': 'pages/cursos.html',
            'indicadores': 'pages/indicadores.html'
        };
    }

    loadPage(pageId) {
        alert('loadPage chamado para: ' + pageId);
        
        // Verificar se a página existe
        if (!this.pages[pageId]) {
            alert('ERRO: Página não encontrada: ' + pageId);
            return;
        }

        // Verificar elementos DOM
        const homeContent = document.getElementById('home-content');
        const pageContent = document.getElementById('page-content');
        const dynamicContent = document.getElementById('dynamic-content');
        const loadingSpinner = document.getElementById('loading-spinner');

        if (!homeContent) {
            alert('ERRO: Elemento home-content não encontrado!');
            return;
        }
        if (!pageContent) {
            alert('ERRO: Elemento page-content não encontrado!');
            return;
        }
        if (!dynamicContent) {
            alert('ERRO: Elemento dynamic-content não encontrado!');
            return;
        }
        if (!loadingSpinner) {
            alert('ERRO: Elemento loading-spinner não encontrado!');
            return;
        }

        alert('Todos os elementos DOM encontrados!');

        try {
            // Esconder conteúdo home e mostrar loading
            homeContent.style.display = 'none';
            pageContent.style.display = 'block';
            loadingSpinner.style.display = 'block';
            dynamicContent.innerHTML = '';

            alert('Loading exibido, iniciando requisição...');

            // Fazer requisição
            const xhr = new XMLHttpRequest();
            xhr.open('GET', this.pages[pageId], true);
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        alert('Página carregada com sucesso!');
                        loadingSpinner.style.display = 'none';
                        dynamicContent.innerHTML = xhr.responseText;
                    } else {
                        alert('ERRO ao carregar página: ' + xhr.status);
                        loadingSpinner.style.display = 'none';
                        dynamicContent.innerHTML = '<div class="alert alert-danger">Erro ao carregar a página.</div>';
                    }
                }
            };
            
            xhr.onerror = function() {
                alert('ERRO de rede ao carregar página!');
                loadingSpinner.style.display = 'none';
                dynamicContent.innerHTML = '<div class="alert alert-danger">Erro de rede.</div>';
            };
            
            xhr.send();
            
        } catch (error) {
            alert('ERRO na execução: ' + error.message);
        }
    }

    showHome() {
        alert('showHome chamado');
        
        const homeContent = document.getElementById('home-content');
        const pageContent = document.getElementById('page-content');
        
        if (homeContent && pageContent) {
            homeContent.style.display = 'block';
            pageContent.style.display = 'none';
            alert('Home exibido com sucesso!');
        } else {
            alert('ERRO: Elementos para mostrar home não encontrados!');
        }
    }
}

// Inicializar quando o DOM estiver pronto
let alertNavManager;

function initAlertNavigation() {
    alert('Inicializando navigation com alerts...');
    alertNavManager = new AlertNavigationManager();
}

// Função global para ser chamada pelos botões
function loadPageAlert(pageId) {
    alert('loadPageAlert wrapper chamado para: ' + pageId);
    if (alertNavManager) {
        alertNavManager.loadPage(pageId);
    } else {
        alert('ERRO: alertNavManager não inicializado!');
    }
}

function showHomeAlert() {
    alert('showHomeAlert wrapper chamado');
    if (alertNavManager) {
        alertNavManager.showHome();
    } else {
        alert('ERRO: alertNavManager não inicializado!');
    }
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAlertNavigation);
} else {
    initAlertNavigation();
}




