import pandas as pd
from sqlalchemy import create_engine
import os
import sys

# Adicionar o diretório raiz do projeto ao sys.path para importar utilities
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from utilities.formatar_tabela import dataframe_to_html

# Configuração do banco de dados (do config.ini)
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'INEP.db'))
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Criar a engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# Query SQL fornecida pelo usuário
SQL_QUERY = """
    SELECT
        ae.nome as area_especifica,
        cc.ano_censo AS "Ano",
        COUNT(DISTINCT cc.ies) AS "IES_total",
        COUNT(DISTINCT cc.curso) AS "Cursos_total",
        SUM(cc.qt_mat) AS "Matrículas_total",
        SUM(cc.qt_conc) AS "Concluintes_total",
        COUNT(DISTINCT CASE WHEN cc.tp_modalidade_ensino = 1 THEN cc.ies END) AS "IES_presencial",
        COUNT(DISTINCT CASE WHEN cc.tp_modalidade_ensino = 1 THEN cc.curso END) AS "Cursos_presencial",
        SUM(CASE WHEN cc.tp_modalidade_ensino = 1 THEN cc.qt_mat ELSE 0 END) AS "Matrículas_presencial",
        SUM(CASE WHEN cc.tp_modalidade_ensino = 1 THEN cc.qt_conc ELSE 0 END) AS "Concluintes_presencial",
        COUNT(DISTINCT CASE WHEN cc.tp_modalidade_ensino = 2 THEN cc.ies END) AS "IES_distancia",
        COUNT(DISTINCT CASE WHEN cc.tp_modalidade_ensino = 2 THEN cc.curso END) AS "Cursos_distancia",
        SUM(CASE WHEN cc.tp_modalidade_ensino = 2 THEN cc.qt_mat ELSE 0 END) AS "Matrículas_distancia",
        SUM(CASE WHEN cc.tp_modalidade_ensino = 2 THEN cc.qt_conc ELSE 0 END) AS "Concluintes_distancia"
    FROM curso_censo cc
    JOIN area_especifica ae on ae.codigo = cc.area_especifica
    WHERE cc.municipio = '4204202' AND cc.ano_censo > 2013
    GROUP BY area_especifica, cc.ano_censo
    ORDER BY area_especifica, cc.ano_censo;
"""

# Executar a query e carregar os dados em um DataFrame
df = pd.read_sql(SQL_QUERY, engine)

# Definir os parâmetros para dataframe_to_html
# As colunas de 3 a 14 (índices 2 a 13) precisam ser alinhadas à direita
column_widths = ['15%', '5%'] + ['7%'] * 12 # Ajustar conforme necessário
column_names = [ # Reintroduzindo column_names
    "Área Específica", "Ano",
    "IES", "Cursos", "Matrículas", "Concluintes",
    "IES", "Cursos", "Matrículas", "Concluintes",
    "IES", "Cursos", "Matrículas", "Concluintes"
]
column_alignments = ['left', 'center'] + ['right'] * 12
header_style = "background-color: #4CAF50; color: white; font-weight: bold; text-align: center;"
row_style = "text-align: center;" # Será sobrescrito pelo column_alignments

# Gerar o HTML do corpo da tabela (sem cabeçalho)
# A função dataframe_to_html já retorna <html><head>...</head><body><table>...</table></body></html>
# Precisamos extrair apenas o conteúdo das linhas (<tr>...</tr>)
html_full_body = dataframe_to_html(df, column_widths, column_names, column_alignments, header_style, row_style, include_header=False)

# Extrair o conteúdo das linhas (<tr>...</tr>)
import re
# A regex agora busca por tudo entre <body><table> e </table></body>
# Isso porque dataframe_to_html não gera <tbody>, apenas <tr>s
body_table_content_match = re.search(r'<body>\s*<table[^>]*>(.*?)</table>\s*</body>', html_full_body, re.DOTALL)
table_rows_content = ""
if body_table_content_match:
    table_rows_content = body_table_content_match.group(1)

# Construir o cabeçalho multinível manualmente
multilevel_header = """
        <thead>
            <tr>
                <th rowspan="2">Área Específica</th>
                <th rowspan="2">Ano</th>
                <th colspan="4">Total Geral</th>
                <th colspan="4">Presencial</th>
                <th colspan="4">A Distância</th>
            </tr>
            <tr>
                <th>IES</th>
                <th>Cursos</th>
                <th>Matrículas</th>
                <th>Concluintes</th>
                <th>IES</th>
                <th>Cursos</th>
                <th>Matrículas</th>
                <th>Concluintes</th>
                <th>IES</th>
                <th>Cursos</th>
                <th>Matrículas</th>
                <th>Concluintes</th>
            </tr>
        </thead>
"""

# Reconstruir o HTML completo da tabela com o cabeçalho multinível
html_table = f"""
<html><head><meta charset='UTF-8'>
        <style>
            table {{width: 100%; border-collapse: collapse;}}
            th {{ {header_style}}}
            td {{{row_style}}}
            tr:nth-child(even) {{background-color: #f2f2f2;}}
            tr:hover {{background-color: #ddd;}}
            .left {{text-align: left;}}
            .center {{text-align: center;}}
            .right {{text-align: right;}}
        </style>
        </head><body>
        <table border='1'>
{multilevel_header}
        <tbody>
{table_rows_content}
        </tbody>
        </table></body></html>
"""

# Caminho para salvar o HTML
output_html_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'tabelas', 'dinamicas_area_especifica.html'))
os.makedirs(os.path.dirname(output_html_path), exist_ok=True)
with open(output_html_path, 'w', encoding='utf-8') as f:
    f.write(html_table)

print(f"HTML da tabela gerado em: {output_html_path}")

# Caminho para salvar o Excel
output_excel_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'tabelas', 'dinamicas_area_especifica.xlsx'))
df.to_excel(output_excel_path, index=False)

print(f"Excel da tabela gerado em: {output_excel_path}")
