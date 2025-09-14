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

# Query SQL para Uniaselvi (código 1472)
SQL_QUERY_UNIASSELVI = """
SELECT 
    cc.ano_censo, 
    SUM(cc.qt_mat) AS matriculas,
    SUM(cc.qt_ing) AS ingressos,
    SUM(cc.qt_conc) AS concluintes,
    SUM(cc.qt_sit_trancada) AS trancados,
    SUM(cc.qt_sit_transferido + cc.qt_sit_desvinculado) AS evadidos
FROM 
    curso_censo cc
WHERE 
    cc.municipio = 4204202 
    AND cc.ano_censo BETWEEN 2014 AND 2024
    AND cc.ies = 1472 
GROUP BY 
    cc.ano_censo
ORDER BY 
    cc.ano_censo;
"""

# Executar a query e carregar os dados em um DataFrame
df_uniaselvi = pd.read_sql(SQL_QUERY_UNIASSELVI, engine)

# Caminho para salvar o JSON
output_json_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'dados'))
os.makedirs(output_json_dir, exist_ok=True)
output_json_path_uniaselvi = os.path.join(output_json_dir, 'analise_ies_uniaselvi.json')

with open(output_json_path_uniaselvi, 'w', encoding='utf-8') as f:
    df_uniaselvi.to_json(f, orient='records', indent=4)

print(f"Dados da Uniaselvi gerados em: {output_json_path_uniaselvi}")

# Caminho para salvar o Excel (opcional)
output_excel_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'tabelas'))
os.makedirs(output_excel_dir, exist_ok=True)
output_excel_path_uniaselvi = os.path.join(output_excel_dir, 'analise_ies_uniaselvi.xlsx')
df_uniaselvi.to_excel(output_excel_path_uniaselvi, index=False)

print(f"Excel da Uniaselvi gerado em: {output_excel_path_uniaselvi}")
