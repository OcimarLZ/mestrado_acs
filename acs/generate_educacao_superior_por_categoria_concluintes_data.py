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

# Query SQL para Concluintes por Categoria Administrativa
SQL_QUERY_CONCLUINTES = """
SELECT 
    cc.ano_censo, 
    ca.nome AS categoria,
    SUM(cc.qt_conc) AS valor
FROM 
    curso_censo cc
JOIN 
    tp_categoria_administrativa ca ON ca.codigo = cc.categoria
WHERE 
    cc.municipio = 4204202 
    AND cc.ano_censo BETWEEN 2014 AND 2024
GROUP BY 
    cc.ano_censo, 
    ca.nome
ORDER BY 
    cc.ano_censo, 
    ca.nome;
"""

# Executar a query e carregar os dados em um DataFrame
df_concluintes = pd.read_sql(SQL_QUERY_CONCLUINTES, engine)

# Caminho para salvar o JSON
output_json_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'dados'))
os.makedirs(output_json_dir, exist_ok=True)
output_json_path_concluintes = os.path.join(output_json_dir, 'educacao_superior_por_categoria_concluintes.json')

with open(output_json_path_concluintes, 'w', encoding='utf-8') as f:
    df_concluintes.to_json(f, orient='records', indent=4)

print(f"Dados de concluintes por categoria gerados em: {output_json_path_concluintes}")

# Caminho para salvar o Excel (opcional, mas bom para consistência)
output_excel_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'tabelas'))
os.makedirs(output_excel_dir, exist_ok=True)
output_excel_path_concluintes = os.path.join(output_excel_dir, 'educacao_superior_por_categoria_concluintes.xlsx')
df_concluintes.to_excel(output_excel_path_concluintes, index=False)

print(f"Excel de concluintes por categoria gerado em: {output_excel_path_concluintes}")
