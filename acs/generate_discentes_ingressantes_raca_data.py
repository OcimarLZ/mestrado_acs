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
     cc.ano_censo AS ano, 
     SUM(cc.qt_ing_branca) AS branca, 
     SUM(cc.qt_ing_parda) AS parda, 
     SUM(cc.qt_ing_preta) AS preta, 
     SUM(cc.qt_ing_indigena) AS indigena, 
     SUM(cc.qt_ing_amarela) AS amarela, 
     SUM(cc.qt_ing_cornd) AS naodeclarada 
 FROM 
     curso_censo cc 
 WHERE 
     cc.municipio = 4204202 and cc.ano_censo > 2013 
 GROUP BY 
     cc.ano_censo 
 ORDER BY 
     cc.ano_censo
"""
df = pd.read_sql(sql, engine)

# Remover colunas onde todos os valores são zero, exceto 'ano'
df = df.loc[:, (df != 0).any(axis=0) | (df.columns == 'ano')]

# Converter para formato de dicionário para o gráfico
data = {
    'anos': df['ano'].tolist(),
    'branca': df['branca'].tolist(),
    'parda': df['parda'].tolist(),
    'preta': df['preta'].tolist(),
    'indigena': df['indigena'].tolist(),
    'amarela': df['amarela'].tolist(),
    'naodeclarada': df['naodeclarada'].tolist()
}

output_path = os.path.join(os.path.dirname(__file__), 'dados_discentes_ingressantes_raca.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"JSON com dados de ingressantes por raça gerado com sucesso em {output_path}")