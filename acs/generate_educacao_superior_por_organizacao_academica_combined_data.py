import pandas as pd
from sqlalchemy import create_engine
import os
import sys

# Adicionar o diretório raiz do projeto ao sys.path para importar utilities
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Configuração do banco de dados (do config.ini)
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'INEP.db'))
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Criar a engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# Query SQL para dados combinados por Organização Acadêmica
SQL_QUERY_ORGANIZACAO_ACADEMICA_COMBINED = """
SELECT 
    cc.ano_censo, 
    oa.nome AS tipo_organizacao,
    SUM(cc.qt_mat) AS matriculas,
    SUM(cc.qt_ing) AS ingressos,
    SUM(cc.qt_conc) AS concluintes,
    SUM(cc.qt_sit_trancada) AS trancados,
    SUM(cc.qt_sit_transferido + cc.qt_sit_desvinculado) AS evadidos
FROM 
    curso_censo cc
JOIN 
    tp_organizacao_academica oa ON oa.codigo = cc.org_academica   
WHERE 
    cc.municipio = 4204202 
    AND cc.ano_censo BETWEEN 2014 AND 2024
GROUP BY 
    cc.ano_censo, 
    oa.nome
ORDER BY 
    cc.ano_censo, 
    oa.nome;
"""

# Executar a query e carregar os dados em um DataFrame
df_organizacao_academica_combined = pd.read_sql(SQL_QUERY_ORGANIZACAO_ACADEMICA_COMBINED, engine)

# Caminho para salvar o JSON
output_json_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'dados'))
os.makedirs(output_json_dir, exist_ok=True)
output_json_path_organizacao_academica_combined = os.path.join(output_json_dir, 'educacao_superior_por_organizacao_academica_combined.json')

with open(output_json_path_organizacao_academica_combined, 'w', encoding='utf-8') as f:
    df_organizacao_academica_combined.to_json(f, orient='records', indent=4)

print(f"Dados combinados por organização acadêmica gerados em: {output_json_path_organizacao_academica_combined}")

# Caminho para salvar o Excel (opcional)
output_excel_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'tabelas'))
os.makedirs(output_excel_dir, exist_ok=True)
output_excel_path_organizacao_academica_combined = os.path.join(output_excel_dir, 'educacao_superior_por_organizacao_academica_combined.xlsx')
df_organizacao_academica_combined.to_excel(output_excel_path_organizacao_academica_combined, index=False)

print(f"Excel de dados combinados por organização acadêmica gerado em: {output_excel_path_organizacao_academica_combined}")
