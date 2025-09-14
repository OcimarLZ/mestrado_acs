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
SELECT 
    cc.ano_censo, 
    r.nome AS tipo_rede,
    SUM(cc.qt_mat) AS matriculas,
    SUM(cc.qt_ing) AS ingressos,
    SUM(cc.qt_conc) AS concluintes,
    SUM(cc.qt_sit_trancada) AS trancadas,
    SUM(cc.qt_sit_transferido + cc.qt_sit_desvinculado) AS evadidos
FROM 
    curso_censo cc
JOIN 
    tp_rede r ON r.codigo = cc.tp_rede
WHERE 
    cc.municipio = 4204202 
    AND cc.ano_censo BETWEEN 2014 AND 2024
GROUP BY 
    cc.ano_censo, 
    r.nome
ORDER BY 
    cc.ano_censo, 
    r.nome;
"""

# Executar a query e carregar os dados em um DataFrame
df = pd.read_sql(SQL_QUERY, engine)

# Converter o DataFrame para formato JSON
json_data = df.to_json(orient='records', indent=4)

# Caminho para salvar o JSON
output_json_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'dados'))
os.makedirs(output_json_dir, exist_ok=True)
output_json_path = os.path.join(output_json_dir, 'educacao_superior_por_rede.json')

with open(output_json_path, 'w', encoding='utf-8') as f:
    f.write(json_data)

print(f"Dados do gráfico gerados em: {output_json_path}")

# Caminho para salvar o Excel
output_excel_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'tabelas', 'educacao_superior_por_rede.xlsx'))
os.makedirs(os.path.dirname(output_excel_path), exist_ok=True)
df.to_excel(output_excel_path, index=False)

print(f"Excel da tabela gerado em: {output_excel_path}")
