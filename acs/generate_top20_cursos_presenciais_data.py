import pandas as pd
from sqlalchemy import create_engine
import os
import sys
import re

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
WITH Cursos_Mais_Matriculados AS (
    SELECT
        c.nome AS curso_nome, -- Seleciona o nome do curso
        SUM(cc.qt_mat) AS total_matriculas
    FROM
        curso_censo cc
    JOIN
        curso c ON cc.curso = c.codigo -- Adiciona o JOIN para pegar o nome do curso
    WHERE
        cc.municipio = 4204202
        AND cc.tp_modalidade_ensino = 1
        AND cc.ano_censo BETWEEN 2014 AND 2024
    GROUP BY
        c.nome -- Agrupa por nome do curso
    ORDER BY
        total_matriculas DESC
    LIMIT 20
)
SELECT
    cc.ano_censo,
    c.nome AS curso,
    COUNT(cc.curso) AS total_cursos,
    COUNT(DISTINCT cc.ies) AS qtde_ies,
    SUM(cc.qt_mat) AS matriculas,
    SUM(cc.qt_ing) AS ingressos,
    SUM(cc.qt_conc) AS concluintes,
    SUM(cc.qt_sit_trancada) AS trancadas,
    SUM(cc.qt_sit_transferido + cc.qt_sit_desvinculado) AS evadidos
FROM
    curso_censo cc
JOIN
    curso c ON cc.curso = c.codigo
JOIN
    Cursos_Mais_Matriculados cm ON c.nome = cm.curso_nome -- AQUI: Mudança no JOIN para usar o nome do curso
WHERE
    cc.municipio = 4204202
    AND cc.tp_modalidade_ensino = 1
    AND cc.ano_censo BETWEEN 2014 AND 2024
GROUP BY
    cc.ano_censo,
    c.nome
ORDER BY
    c.nome,
    cc.ano_censo;
"""

# Executar a query e carregar os dados em um DataFrame
df = pd.read_sql(SQL_QUERY, engine)

print("DataFrame head:")
print(df.head())
print("\nDataFrame columns:")
print(df.columns)

# Definir os parâmetros para dataframe_to_html
column_widths = ['5%', '20%', '7%', '7%', '10%', '10%', '10%', '10%', '10%'] # Ajustar conforme necessário
column_names = [
    "Ano", "Curso", "Total Cursos", "Qtde IES", "Matrículas",
    "Ingressos", "Concluintes", "Trancadas", "Evadidos"
]
column_alignments = ['center', 'left'] + ['right'] * 7
header_style = "background-color: #4CAF50; color: white; font-weight: bold; text-align: center;"
row_style = "text-align: center;" # Será sobrescrito pelo column_alignments

# Gerar o HTML do corpo da tabela (sem cabeçalho)
html_full_body = dataframe_to_html(df, column_widths, column_names, column_alignments, header_style, row_style, include_header=False)

# Extrair o conteúdo das linhas (<tr>...</tr>)
# A regex busca por tudo entre <body><table> e </table></body>
body_table_content_match = re.search(r'<body>\s*<table[^>]*>(.*?)</table>\s*</body>', html_full_body, re.DOTALL)
table_rows_content = ""
if body_table_content_match:
    table_rows_content = body_table_content_match.group(1)

# Construir o cabeçalho da tabela manualmente
table_header = """
        <thead>
            <tr>
                <th>Ano</th>
                <th>Curso</th>
                <th>Total Cursos</th>
                <th>Qtde IES</th>
                <th>Matrículas</th>
                <th>Ingressos</th>
                <th>Concluintes</th>
                <th>Trancadas</th>
                <th>Evadidos</th>
            </tr>
        </thead>
"""

# Reconstruir o HTML completo da tabela
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
{table_header}
        <tbody>
{table_rows_content}
        </tbody>
        </table></body></html>
"""

# Caminho para salvar o HTML
output_html_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'tabelas', 'top20_cursos_presenciais.html'))
os.makedirs(os.path.dirname(output_html_path), exist_ok=True)
with open(output_html_path, 'w', encoding='utf-8') as f:
    f.write(html_table)

print(f"HTML da tabela gerado em: {output_html_path}")

# Caminho para salvar o Excel
output_excel_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'tabelas', 'top20_cursos_presenciais.xlsx'))
os.makedirs(os.path.dirname(output_excel_path), exist_ok=True)
df.to_excel(output_excel_path, index=False)

print(f"Excel da tabela gerado em: {output_excel_path}")
