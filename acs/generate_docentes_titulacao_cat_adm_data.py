
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
    tca.nome AS categoria_adm, 
    i.ano_censo AS ano,
    SUM(i.qt_doc_ex_sem_grad) AS sem_graduacao,
    SUM(i.qt_doc_ex_grad) AS graduacao,
    SUM(i.qt_doc_ex_esp) AS especializacao,
    SUM(i.qt_doc_ex_mest) AS mestrado,
    SUM(i.qt_doc_ex_dout) AS doutorado,
    SUM(i.qt_doc_ex_titulacao_ndef) AS titulacao_ndef
FROM 
    ies_censo i
JOIN tp_categoria_administrativa tca ON tca.codigo = i.categoria 
WHERE 
    i.municipio = 4204202 AND i.ano_censo >= 2014 AND i.ano_censo <= 2024
GROUP BY 
    tca.nome, i.ano_censo
ORDER BY 
    tca.nome, i.ano_censo;
"""
df = pd.read_sql(sql, engine)

# Remover colunas onde todos os valores são zero, exceto para a coluna 'ano' e 'categoria_adm'
df = df.loc[:, (df.columns.isin(['ano', 'categoria_adm'])) | (df != 0).any(axis=0)]

# Convertendo o DataFrame para um formato de dicionário e salvando como JSON
dados_json = df.to_dict(orient='records')

output_path = os.path.join(os.path.dirname(__file__), 'dados_docentes_titulacao_cat_adm.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(dados_json, f, ensure_ascii=False, indent=4)

print(f"JSON com dados de titulação de docentes por categoria administrativa gerado com sucesso em {output_path}")
