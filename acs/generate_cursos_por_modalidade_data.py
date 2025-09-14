import pandas as pd
from sqlalchemy import create_engine
import os
import json

# Configuração do banco de dados (do config.ini)
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'INEP.db'))
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Criar a engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# Query SQL fornecida pelo usuário
SQL_QUERY = """
    SELECT
        cc.ano_censo AS ano,
        count(cc.curso) as qtde_cursos,
        COUNT(CASE WHEN cc.tp_modalidade_ensino = 1 THEN cc.ies ELSE NULL END) AS presencial,
        COUNT(CASE WHEN cc.tp_modalidade_ensino = 2 THEN cc.ies ELSE NULL END) AS distancia
    FROM
        curso_censo cc
    WHERE
        cc.municipio = '4204202' AND cc.ano_censo > 2013
    GROUP BY
        cc.ano_censo
    ORDER BY
        cc.ano_censo;
"""

# Executar a query e carregar os dados em um DataFrame
df = pd.read_sql(SQL_QUERY, engine)

# Converter o DataFrame para formato JSON
# Orient='records' para uma lista de objetos, onde cada objeto é uma linha
json_data = df.to_json(orient='records', indent=4)

# Caminho para salvar o JSON
output_json_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'dados'))
os.makedirs(output_json_dir, exist_ok=True)
output_json_path = os.path.join(output_json_dir, 'cursos_por_modalidade.json')

with open(output_json_path, 'w', encoding='utf-8') as f:
    f.write(json_data)

print(f"Dados do gráfico gerados em: {output_json_path}")

# Opcional: Salvar também em Excel para exportação
output_excel_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'tabelas', 'cursos_por_modalidade.xlsx'))
os.makedirs(os.path.dirname(output_excel_path), exist_ok=True)
df.to_excel(output_excel_path, index=False)

print(f"Dados do gráfico gerados em Excel: {output_excel_path}")
