// Sistema de navegação modular
class NavigationManager {
    constructor() {
        this.currentPage = 'home';
        this.pages = {
            'home': {
                title: 'Início',
                file: null // Página inicial já está no HTML
            },
            'ies-perfil': {
                title: '4.1 Perfil das IES',
                file: 'pages/ies-perfil.html'
            },
            'areas-conhecimento': {
                title: '4.2 Áreas de Conhecimento',
                file: 'pages/areas-conhecimento.html'
            },
            'cursos-superiores': {
                title: '4.3 Cursos Superiores',
                file: 'pages/cursos-superiores.html'
            },
            'docentes-tecnicos': {
                title: '4.6 Docentes e Técnicos',
                file: 'pages/docentes-tecnicos.html'
            },
            'discentes': {
                title: 'Discentes',
                file: 'pages/discentes.html'
            },
            'meta12-pne': {
                title: 'Meta 12 PNE',
                file: 'pages/meta12-pne.html'
            },
            'populacao': {
                title: 'População Chapecó',
                file: 'pages/populacao.html'
            }
        };
        
        this.loadedScripts = new Set();
        this.init();
    }

    init() {
        // Atualizar links ativos na navegação
        this.updateActiveNavLinks();
        
        // Configurar histórico do navegador
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.page) {
                this.loadPage(event.state.page, false);
            }
        });
        
        // Verificar se há uma página específica na URL
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page');
        if (page && this.pages[page]) {
            this.loadPage(page, false);
        }
    }

    async loadPage(pageId, addToHistory = true) {
        console.log(`Tentando carregar página: ${pageId}`);
        
        if (!this.pages[pageId]) {
            console.error(`Página '${pageId}' não encontrada`);
            return;
        }

        // Se for a página home, mostrar conteúdo inicial
        if (pageId === 'home') {
            console.log('Carregando página home');
            this.showHomePage();
            this.updateURL(pageId, addToHistory);
            return;
        }

        // Mostrar loading
        console.log('Mostrando loading...');
        this.showLoading();

        try {
            // Carregar conteúdo da página
            console.log(`Buscando conteúdo de: ${this.pages[pageId].file}`);
            const content = await this.fetchPageContent(pageId);
            console.log('Conteúdo carregado com sucesso');
            
            // Mostrar conteúdo
            this.showPageContent(content, pageId);
            
            // Carregar scripts específicos da página
            await this.loadPageScripts(pageId);
            
            // Atualizar URL
            this.updateURL(pageId, addToHistory);
            
            // Atualizar navegação
            this.updateActiveNavLinks(pageId);
            
        } catch (error) {
            console.error('Erro ao carregar página:', error);
            this.showError('Erro ao carregar a página. Tente novamente.');
        }
    }

    async fetchPageContent(pageId) {
        const response = await fetch(this.pages[pageId].file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.text();
    }

    showHomePage() {
        document.getElementById('home-content').style.display = 'block';
        document.getElementById('page-content').style.display = 'none';
        
        // Animar entrada
        setTimeout(() => {
            document.getElementById('home-content').classList.add('active');
        }, 50);
        
        this.currentPage = 'home';
        document.title = 'A Educação Superior em Chapecó (2014-2024)';
    }

    showPageContent(content, pageId) {
        console.log('Mostrando conteúdo da página:', pageId);
        
        const homeContent = document.getElementById('home-content');
        const pageContent = document.getElementById('page-content');
        const dynamicContent = document.getElementById('dynamic-content');
        const loadingSpinner = document.getElementById('loading-spinner');
        
        if (!homeContent || !pageContent || !dynamicContent || !loadingSpinner) {
            console.error('Elementos DOM não encontrados:', {
                homeContent: !!homeContent,
                pageContent: !!pageContent,
                dynamicContent: !!dynamicContent,
                loadingSpinner: !!loadingSpinner
            });
            return;
        }
        
        homeContent.style.display = 'none';
        pageContent.style.display = 'block';
        dynamicContent.innerHTML = content;
        loadingSpinner.style.display = 'none';
        
        // Animar entrada
        setTimeout(() => {
            pageContent.classList.add('active');
        }, 50);
        
        this.currentPage = pageId;
        document.title = `${this.pages[pageId].title} - Educação Superior Chapecó`;
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        console.log('Conteúdo da página exibido com sucesso');
    }

    showLoading() {
        document.getElementById('home-content').classList.remove('active');
        document.getElementById('page-content').classList.remove('active');
        
        setTimeout(() => {
            document.getElementById('home-content').style.display = 'none';
            document.getElementById('page-content').style.display = 'block';
            document.getElementById('loading-spinner').style.display = 'inline-block';
            document.getElementById('dynamic-content').innerHTML = '';
        }, 200);
    }

    showError(message) {
        document.getElementById('dynamic-content').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Ops! Algo deu errado</h4>
                <p>${message}</p>
                <hr>
                <p class="mb-0">
                    <button class="btn btn-outline-danger" onclick="loadPage('home')">
                        <i class="fas fa-home me-2"></i>Voltar ao Início
                    </button>
                </p>
            </div>
        `;
        document.getElementById('loading-spinner').style.display = 'none';
    }

    async loadPageScripts(pageId) {
        // Mapear scripts específicos para cada página
        const pageScripts = {
            'ies-perfil': [
                'educacao_superior_por_rede_chart.js',
                'educacao_superior_por_modalidade_presencial_combined_chart.js',
                'educacao_superior_por_modalidade_ead_combined_chart.js',
                'educacao_superior_por_organizacao_academica_combined_chart.js',
                'analise_ies_uffs_chart.js',
                'analise_ies_unoesc_chart.js',
                'menores_ies_resumo_table.js'
            ],
            'areas-conhecimento': [
                'dinamicas_area_content.js',
                'dinamicas_area_especifica_content.js'
            ],
            'cursos-superiores': [
                'cursos_por_categoria_chart.js',
                'cursos_por_modalidade_chart.js',
                'top20_cursos_presenciais_table.js',
                'top20_cursos_distancia_table.js'
            ],
            'docentes-tecnicos': [
                'docentes_geral_chart.js',
                'docentes_idade_chart.js',
                'docentes_raca_chart.js',
                'docentes_titulacao_chart.js',
                'docentes_vinculo_chart.js',
                'tecnicos_geral_chart.js'
            ],
            'discentes': [
                'discentes_raca_chart.js',
                'discentes_origem_escola_chart.js',
                'discentes_idade_ingressantes_chart.js',
                'discentes_idade_ingressantes_modalidade_chart.js'
            ],
            'meta12-pne': [
                'meta12_pne_chart.js'
            ],
            'populacao': [
                'populacao_chapeco_chart.js'
            ]
        };

        const scripts = pageScripts[pageId] || [];
        
        for (const scriptFile of scripts) {
            if (!this.loadedScripts.has(scriptFile)) {
                await this.loadScript(scriptFile);
                this.loadedScripts.add(scriptFile);
            }
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    updateURL(pageId, addToHistory) {
        const url = pageId === 'home' ? 
            window.location.pathname : 
            `${window.location.pathname}?page=${pageId}`;
            
        if (addToHistory) {
            history.pushState({ page: pageId }, '', url);
        } else {
            history.replaceState({ page: pageId }, '', url);
        }
    }

    updateActiveNavLinks(pageId = 'home') {
        // Remover classe active de todos os links
        document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
            link.classList.remove('active');
        });
        
        // Adicionar classe active ao link correspondente
        if (pageId === 'home') {
            document.querySelector('.nav-link[onclick="loadPage(\'home\')"]')?.classList.add('active');
        } else {
            // Para outras páginas, procurar no dropdown
            document.querySelector(`[onclick="loadPage('${pageId}')"]`)?.classList.add('active');
        }
    }
}

// Instanciar o gerenciador de navegação quando o DOM estiver carregado
let navManager;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando NavigationManager');
    navManager = new NavigationManager();
});

// Função global para carregar páginas (usada nos onclick)
function loadPage(pageId) {
    console.log(`loadPage chamada para: ${pageId}`);
    if (navManager) {
        navManager.loadPage(pageId);
    } else {
        console.error('NavigationManager não foi inicializado ainda');
        // Tentar novamente após um pequeno delay
        setTimeout(() => {
            if (navManager) {
                navManager.loadPage(pageId);
            } else {
                console.error('NavigationManager ainda não disponível');
            }
        }, 100);
    }
}

// Função para exportar dados (mantida para compatibilidade)
function exportToExcel(data, filename) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dados');
    XLSX.writeFile(wb, `${filename}.xlsx`);
}

// Utilitários para gráficos
function createChart(canvasId, config) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn(`Canvas ${canvasId} não encontrado`);
        return null;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('ERRO: Chart.js não está carregado!');
        return null;
    }
    
    // Destruir gráfico existente se houver
    if (canvas.chart) {
        canvas.chart.destroy();
    }
    
    canvas.chart = new Chart(canvas, config);
    return canvas.chart;
}

// Função para aguardar carregamento do DOM
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
            resolve(element);
            return;
        }
        
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Elemento ${selector} não encontrado após ${timeout}ms`));
        }, timeout);
    });
}




