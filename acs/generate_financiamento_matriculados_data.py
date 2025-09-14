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
    SUM(cc.qt_mat_fies + cc.qt_mat_nrpfies) AS fies,
    SUM(cc.qt_mat_financ) AS financiamento,
    SUM(cc.qt_mat_prounii + cc.qt_mat_prounip) as prouni,
    SUM(cc.qt_mat_parfor) AS parfor
FROM
    curso_censo cc
WHERE
    cc.municipio = 4204202 AND cc.ano_censo > 2013
GROUP BY
    cc.ano_censo
ORDER BY
    cc.ano_censo
"""

# Executar a query e carregar os dados em um DataFrame
df = pd.read_sql(SQL_QUERY, engine)

# Criar a estrutura de dados para o JSON
data = {
    'anos': df['ano'].tolist(),
    'datasets': []
}

# Adicionar os datasets
fontes_financiamento = ["fies", "financiamento", "prouni", "parfor"]
for fonte in fontes_financiamento:
    data['datasets'].append({
        'label': fonte.capitalize(),
        'data': df[fonte].tolist()
    })


# Caminho para salvar o JSON
output_json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'dados_financiamento_matriculados.json'))

# Salvar os dados em um arquivo JSON
with open(output_json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"JSON dos dados gerado em: {output_json_path}")
