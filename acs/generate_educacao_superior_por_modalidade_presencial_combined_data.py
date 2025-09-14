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

# Query SQL para dados combinados por Modalidade de Ensino (Presencial)
SQL_QUERY_PRESENCIAL_COMBINED = """
SELECT 
    cc.ano_censo, 
    tm.nome AS modalidade,
    SUM(cc.qt_mat) AS matriculas,
    SUM(cc.qt_ing) AS ingressos,
    SUM(cc.qt_conc) AS concluintes,
    SUM(cc.qt_sit_trancada) AS trancados,
    SUM(cc.qt_sit_transferido + cc.qt_sit_desvinculado) AS evadidos
FROM 
    curso_censo cc
JOIN 
    tp_modal_ensino tm ON tm.codigo = cc.tp_modalidade_ensino
WHERE 
    cc.municipio = 4204202 
    AND cc.ano_censo BETWEEN 2014 AND 2024
    AND tm.codigo = 1 -- Código para Presencial
GROUP BY 
    cc.ano_censo, 
    tm.nome
ORDER BY 
    cc.ano_censo, 
    tm.nome;
"""

# Executar a query e carregar os dados em um DataFrame
df_presencial_combined = pd.read_sql(SQL_QUERY_PRESENCIAL_COMBINED, engine)

# Caminho para salvar o JSON
output_json_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'dados'))
os.makedirs(output_json_dir, exist_ok=True)
output_json_path_presencial_combined = os.path.join(output_json_dir, 'educacao_superior_por_modalidade_presencial_combined.json')

with open(output_json_path_presencial_combined, 'w', encoding='utf-8') as f:
    df_presencial_combined.to_json(f, orient='records', indent=4)

print(f"Dados combinados presenciais por modalidade gerados em: {output_json_path_presencial_combined}")

# Caminho para salvar o Excel (opcional)
output_excel_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'tabelas'))
os.makedirs(output_excel_dir, exist_ok=True)
output_excel_path_presencial_combined = os.path.join(output_excel_dir, 'educacao_superior_por_modalidade_presencial_combined.xlsx')
df_presencial_combined.to_excel(output_excel_path_presencial_combined, index=False)

print(f"Excel de dados combinados presenciais por modalidade gerado em: {output_excel_path_presencial_combined}")
