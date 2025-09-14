import pandas as pd
from sqlalchemy import create_engine
import os
import json

# Configuração do banco de dados
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'INEP.db'))
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Criar a engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# Query SQL
SQL_QUERY = """
SELECT
    cc.ano_censo AS ano,
    ca.nome as categoria,
    SUM(cc.qt_mat_procescpublica) AS publica,
    SUM(cc.qt_mat_procescprivada) AS privada
FROM
    curso_censo cc
JOIN
    tp_categoria_administrativa ca ON ca.codigo = cc.categoria
WHERE
    cc.municipio = 4204202 AND cc.ano_censo > 2013
GROUP BY
    cc.ano_censo, ca.nome
ORDER BY
    cc.ano_censo, ca.nome
"""

# Executar a query e carregar os dados em um DataFrame
df = pd.read_sql(SQL_QUERY, engine)

# Pivot a tabela para ter anos como índice e categorias e tipo de escola como colunas
df_pivot = df.pivot_table(index='ano', columns='categoria', values=['publica', 'privada']).fillna(0)

# Obter a lista de anos
anos = df_pivot.index.tolist()

# Criar a estrutura de dados para o JSON
data = {
    'anos': anos,
    'datasets': []
}

# Adicionar os datasets
for categoria in df['categoria'].unique():
    data['datasets'].append({
        'label': f'Pública - {categoria}',
        'data': df_pivot[('publica', categoria)].tolist()
    })
    data['datasets'].append({
        'label': f'Privada - {categoria}',
        'data': df_pivot[('privada', categoria)].tolist()
    })


# Caminho para salvar o JSON
output_json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'dados_discentes_origem_escola_categoria.json'))

# Salvar os dados em um arquivo JSON
with open(output_json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"JSON dos dados gerado em: {output_json_path}")
