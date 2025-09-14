
import pandas as pd
import json
import os
import sys
from sqlalchemy import create_engine

# Adicionar o diretório raiz do projeto ao sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Configuração do banco de dados
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'INEP.db'))
DATABASE_URL = f"sqlite:///{DB_PATH}"
engine = create_engine(DATABASE_URL)

# Monta o SQL
sql = """
SELECT 
    i.ano_censo AS ano,
    SUM(i.qt_doc_ex_0_29) AS idade_0_29,
    SUM(i.qt_doc_ex_30_34) AS idade_30_34,
    SUM(i.qt_doc_ex_35_39) AS idade_35_39,
    SUM(i.qt_doc_ex_40_44) AS idade_40_44,
    SUM(i.qt_doc_ex_45_49) AS idade_45_49,
    SUM(i.qt_doc_ex_50_54) AS idade_50_54,
    SUM(i.qt_doc_ex_55_59) AS idade_55_59,
    SUM(i.qt_doc_ex_60_mais) AS idade_60_mais
FROM 
    ies_censo i
WHERE 
    i.municipio = 4204202 AND i.ano_censo >= 2014 AND i.ano_censo <= 2024
GROUP BY 
    i.ano_censo
ORDER BY 
    i.ano_censo;
"""
df = pd.read_sql(sql, engine)

# Remover colunas onde todos os valores são zero, exceto para a coluna 'ano'
df = df.loc[:, (df != 0).any(axis=0)]

# Convertendo o DataFrame para um formato de dicionário e salvando como JSON
dados_json = df.to_dict(orient='records')

output_path = os.path.join(os.path.dirname(__file__), 'dados_docentes_idade.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(dados_json, f, ensure_ascii=False, indent=4)

print(f"JSON com dados de idade de docentes gerado com sucesso em {output_path}")
