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
    me.nome as modalidade,
    SUM(cc.qt_conc_18_24) AS "18a24anos",
    SUM(cc.qt_conc_25_29) AS "25a29anos",
    SUM(cc.qt_conc_30_34 + cc.qt_conc_35_39) AS "30a39anos",
    SUM(cc.qt_conc_40_49 + cc.qt_conc_50_59) AS "40a59anos",
    SUM(cc.qt_conc_60_mais) AS "60oumais"
FROM
    curso_censo cc
JOIN
    tp_modalidade_ensino me ON me.codigo = cc.tp_modalidade_ensino
WHERE
    cc.municipio = 4204202 AND cc.ano_censo > 2013
GROUP BY
    cc.ano_censo, me.nome
ORDER BY
    cc.ano_censo, me.nome
"""

# Executar a query e carregar os dados em um DataFrame
df = pd.read_sql(SQL_QUERY, engine)

# Pivot a tabela para ter anos como índice e modalidades e faixas etarias como colunas
df_pivot = df.pivot_table(index='ano', columns='modalidade', values=["18a24anos", "25a29anos", "30a39anos", "40a59anos", "60oumais"]).fillna(0)

# Obter a lista de anos
anos = df_pivot.index.tolist()

# Criar a estrutura de dados para o JSON
data = {
    'anos': anos,
    'datasets': []
}

# Adicionar os datasets
faixas_etarias = ["18a24anos", "25a29anos", "30a39anos", "40a59anos", "60oumais"]
modalidades = df['modalidade'].unique()

for modalidade in modalidades:
    for faixa in faixas_etarias:
        data['datasets'].append({
            'label': f"{faixa.replace('anos', ' anos').replace('a', ' a ').replace('oumais', ' ou mais')} - {modalidade}",
            'data': df_pivot[(faixa, modalidade)].tolist()
        })


# Caminho para salvar o JSON
output_json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'dados_discentes_idade_concluintes_modalidade.json'))

# Salvar os dados em um arquivo JSON
with open(output_json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"JSON dos dados gerado em: {output_json_path}")
