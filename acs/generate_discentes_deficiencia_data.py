
import json
import pandas as pd
from sqlalchemy import create_engine, text

# Conectar ao banco de dados SQLite
engine = create_engine('sqlite:///D:/ProjetosPY/inep/INEP.db')

# Query para extrair os dados de estudantes com deficiência
query = """
SELECT
    ano_censo AS ano,
    SUM(qt_mat_deficiente) AS total_deficientes
FROM
    censo_es
WHERE
    municipio = 4204202 AND ano_censo > 2013
GROUP BY
    ano_censo
ORDER BY
    ano_censo;
"""

# Executar a query e carregar os dados em um DataFrame
with engine.connect() as connection:
    df = pd.read_sql(text(query), connection)

# Converter o DataFrame para um dicionário no formato desejado
data = {
    'anos': df['ano'].tolist(),
    'total_deficientes': df['total_deficientes'].tolist()
}

# Salvar os dados em um arquivo JSON
with open('D:/ProjetosPY/inep/acs/dados_discentes_deficiencia.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Dados de estudantes com deficiência gerados com sucesso!")
