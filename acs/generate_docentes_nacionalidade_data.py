
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
    SUM(i.qt_doc_ex_bra) AS brasileiros,
    SUM(i.qt_doc_ex_est) AS estrangeiros
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

# Substituindo NaN por 0 e convertendo para inteiros
df = df.fillna(0).astype({
    'brasileiros': 'int',
    'estrangeiros': 'int'
})

# Convertendo o DataFrame para um formato de dicionário e salvando como JSON
dados_json = df.to_dict(orient='records')

output_path = os.path.join(os.path.dirname(__file__), 'dados_docentes_nacionalidade.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(dados_json, f, ensure_ascii=False, indent=4)

print(f"JSON com dados de nacionalidade de docentes gerado com sucesso em {output_path}")
