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
    SUM(cc.qt_mat_apoio_social) AS apoio_social,
    SUM(cc.qt_mat_deficiente) AS deficientes,
    SUM(cc.qt_mat_reserva_vaga) as reserva_vagas,
    SUM(cc.qt_mat_rvsocial_rf) AS reserva_social,
    SUM(cc.qt_mat_rvetnico)AS reserva_etnica
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
variaveis_inclusao = ["apoio_social", "deficientes", "reserva_vagas", "reserva_social", "reserva_etnica"]
for variavel in variaveis_inclusao:
    data['datasets'].append({
        'label': variavel.replace('_', ' ').capitalize(),
        'data': df[variavel].tolist()
    })


# Caminho para salvar o JSON
output_json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'dados_inclusao_matriculados.json'))

# Salvar os dados em um arquivo JSON
with open(output_json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"JSON dos dados gerado em: {output_json_path}")
