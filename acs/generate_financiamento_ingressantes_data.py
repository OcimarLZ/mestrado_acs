import pandas as pd
import json
import sqlite3

# Conectar ao banco de dados
conn = sqlite3.connect('../INEP.db')

# SQL query
sql = """
SELECT 
    cc.ano_censo AS ano,
    SUM(cc.qt_ing_fies + cc.qt_ing_nrpfies) AS fies,
    SUM(cc.qt_ing_financ) AS financiamento,
    SUM(cc.qt_ing_prounii + cc.qt_ing_prounip) as prouni,
    SUM(cc.qt_ing_parfor) AS parfor
FROM 
    curso_censo cc
WHERE 
    cc.municipio = 4204202 and cc.ano_censo > 2013
GROUP BY 
    cc.ano_censo 
ORDER BY 
    cc.ano_censo
"""

# Executar a query e carregar em um DataFrame
df = pd.read_sql_query(sql, conn)

# Fechar a conexão
conn.close()

# Preparar os dados para o JSON
data = {
    "anos": df['ano'].tolist(),
    "datasets": [
        {
            "label": "FIES",
            "data": df['fies'].tolist()
        },
        {
            "label": "Financiamento",
            "data": df['financiamento'].tolist()
        },
        {
            "label": "PROUNI",
            "data": df['prouni'].tolist()
        },
        {
            "label": "PARFOR",
            "data": df['parfor'].tolist()
        }
    ]
}

# Salvar para o arquivo JSON
with open('dados_financiamento_ingressantes.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print("JSON 'dados_financiamento_ingressantes.json' gerado com sucesso.")
