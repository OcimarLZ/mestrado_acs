import sqlite3
import json

# Conectar ao banco de dados
conn = sqlite3.connect('../INEP.db')
cursor = conn.cursor()

# Executar a consulta SQL
query = """
SELECT  
    cc.ano_censo AS ano, 
    SUM(cc.qt_conc_fies + cc.qt_conc_nrpfies) AS fies, 
    SUM(cc.qt_conc_financ) AS financiamento, 
    SUM(cc.qt_conc_prounii + cc.qt_conc_prounip) as prouni, 
    SUM(cc.qt_conc_parfor) AS parfor 
FROM  
    curso_censo cc 
WHERE  
    cc.municipio = 4204202 and cc.ano_censo > 2013 
GROUP BY  
    cc.ano_censo 
ORDER BY  
    cc.ano_censo
"""

cursor.execute(query)
dados = cursor.fetchall()

# Processar os dados
anos = [row[0] for row in dados]
datasets = {
    'FIES': [row[1] for row in dados],
    'Financiamento': [row[2] for row in dados],
    'ProUni': [row[3] for row in dados],
    'PARFOR': [row[4] for row in dados]
}

resultado = {
    'anos': anos,
    'datasets': datasets
}

# Salvar no arquivo JSON
with open('dados_financiamento_concluintes.json', 'w', encoding='utf-8') as f:
    json.dump(resultado, f, ensure_ascii=False, indent=2)

print('Arquivo dados_financiamento_concluintes.json criado com sucesso')
print(f'Anos: {anos}')
print(f'Datasets: {list(datasets.keys())}')

conn.close()