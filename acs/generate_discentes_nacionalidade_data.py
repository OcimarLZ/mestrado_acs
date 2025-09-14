
import json
import pandas as pd
from sqlalchemy import create_engine, text

# Conectar ao banco de dados SQLite
engine = create_engine('sqlite:///D:/ProjetosPY/inep/INEP.db')

# Query para extrair os dados de nacionalidade dos discentes
query = """
SELECT
    ano_censo AS ano,
    SUM(qt_mat_nacbras) AS brasileiros,
    SUM(qt_mat_nacestrang) AS estrangeiros
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
    'brasileiros': df['brasileiros'].tolist(),
    'estrangeiros': df['estrangeiros'].tolist()
}

# Salvar os dados em um arquivo JSON
with open('D:/ProjetosPY/inep/acs/dados_discentes_nacionalidade.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Dados de nacionalidade dos discentes gerados com sucesso!")
