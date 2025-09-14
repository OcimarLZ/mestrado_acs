
import json
import pandas as pd
from sqlalchemy import create_engine, text

# Conectar ao banco de dados SQLite
engine = create_engine('sqlite:///D:/ProjetosPY/inep/INEP.db')

# Query para extrair os dados
query = """
SELECT 
    i.ano_censo AS ano,
    SUM(i.qt_tec_total) AS total_tecnicos,
    SUM(i.qt_tec_doutorado_fem + i.qt_tec_especializacao_fem + i.qt_tec_fundamental_comp_fem + i.qt_tec_fundamental_incomp_fem + i.qt_tec_mestrado_fem + i.qt_tec_medio_fem + i.qt_tec_superior_fem) AS femininos,
    SUM(i.qt_tec_doutorado_masc + i.qt_tec_especializacao_masc + i.qt_tec_fundamental_comp_masc + i.qt_tec_fundamental_incomp_masc + i.qt_tec_mestrado_masc + i.qt_tec_medio_masc + i.qt_tec_superior_masc) AS masculinos,
    SUM(i.qt_tec_doutorado_fem + i.qt_tec_doutorado_masc) as doutores,
    SUM(i.qt_tec_mestrado_fem + i.qt_tec_mestrado_masc) as mestres,
    SUM(i.qt_tec_especializacao_fem + i.qt_tec_especializacao_masc) as especialistas,
    SUM(i.qt_tec_superior_fem + i.qt_tec_superior_masc) as superior,
    SUM(i.qt_tec_medio_fem + i.qt_tec_medio_masc) as medio,
    SUM(i.qt_tec_fundamental_comp_fem + i.qt_tec_fundamental_comp_masc) as fundamental,
    SUM(i.qt_tec_fundamental_incomp_fem + i.qt_tec_fundamental_incomp_masc) as fundamental_incompleto
FROM 
    ies_censo i
WHERE 
    i.municipio = 4204202 and i.ano_censo > 2013
GROUP BY 
    i.ano_censo
ORDER BY 
    i.ano_censo;
"""

# Executar a query e carregar os dados em um DataFrame
with engine.connect() as connection:
    df = pd.read_sql(text(query), connection)

# Converter o DataFrame para um dicionário no formato desejado
data = {
    'anos': df['ano'].tolist(),
    'total_tecnicos': df['total_tecnicos'].tolist(),
    'femininos': df['femininos'].tolist(),
    'masculinos': df['masculinos'].tolist(),
    'doutores': df['doutores'].tolist(),
    'mestres': df['mestres'].tolist(),
    'especialistas': df['especialistas'].tolist(),
    'superior': df['superior'].tolist(),
    'medio': df['medio'].tolist(),
    'fundamental': df['fundamental'].tolist(),
    'fundamental_incompleto': df['fundamental_incompleto'].tolist()
}

# Salvar os dados em um arquivo JSON
with open('D:/ProjetosPY/inep/acs/dados_tecnicos_geral.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("Dados dos técnicos administrativos gerados com sucesso!")

