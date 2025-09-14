from flask import Flask, render_template, request, redirect, url_for
import os

app = Flask(__name__)

# Configurar pasta de templates e static
app.template_folder = 'templates'
app.static_folder = 'static'

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/page/<page_id>')
def show_page(page_id):
    # Mapeamento de páginas
    pages = {
        'ies-perfil': {
            'title': '4.1 Perfil das IES',
            'file': 'pages/ies-perfil.html',
            'description': 'Análise das Instituições de Ensino Superior em operação em Chapecó'
        },
        'discentes': {
            'title': 'Discentes',
            'file': 'pages/discentes.html',
            'description': 'Perfil e dinâmicas do corpo discente'
        },
        'docentes-tecnicos': {
            'title': '4.6 Docentes e Técnicos',
            'file': 'pages/docentes.html',
            'description': 'Análise do corpo docente e técnico das IES'
        },
        'areas-conhecimento': {
            'title': '4.2 Áreas de Conhecimento',
            'file': 'pages/areas-conhecimento.html',
            'description': 'Dinâmicas da educação superior por área de conhecimento'
        },
        'cursos-superiores': {
            'title': '4.3 Cursos Superiores',
            'file': 'pages/cursos.html',
            'description': 'Análise sobre os cursos superiores em Chapecó'
        },
        'meta12-pne': {
            'title': 'Meta 12 PNE',
            'file': 'pages/meta12-pne.html',
            'description': 'Análise da Meta 12 do Plano Nacional de Educação'
        },
        'populacao': {
            'title': 'População Chapecó',
            'file': 'pages/populacao.html',
            'description': 'Dados populacionais de Chapecó'
        }
    }
    
    if page_id not in pages:
        return redirect(url_for('home'))
    
    page_info = pages[page_id]
    
    # Tentar ler o arquivo da página
    try:
        # Usar caminho absoluto baseado no diretório atual
        file_path = os.path.join(os.path.dirname(__file__), page_info['file'])
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except FileNotFoundError:
        content = f'<div class="alert alert-warning">Página "{page_info["title"]}" em desenvolvimento.</div>'
    except Exception as e:
        content = f'<div class="alert alert-danger">Erro ao carregar página: {str(e)}</div>'
    
    return render_template('page_flask.html', 
                         page_title=page_info['title'],
                         page_content=content,
                         page_description=page_info['description'])

if __name__ == '__main__':
    print('🚀 Iniciando servidor Flask...')
    print('📍 Acesse: http://localhost:5000')
    app.run(debug=True, host='0.0.0.0', port=5000)