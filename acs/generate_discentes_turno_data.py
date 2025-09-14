import sqlite3
import json
import os

# Caminho para o banco de dados
db_path = os.path.join(os.path.dirname(__file__), '..', 'INEP.db')
print(f"Conectando ao banco: {db_path}")

# SQL para obter dados de discentes por turno (2014-2023)
sql_discentes_turno = """
SELECT 
    cc.ano_censo AS ano,
    SUM(cc.qt_ing_diurno) AS ingressantes_diurno,
    SUM(cc.qt_ing_noturno) AS ingressantes_noturno,
    SUM(cc.qt_conc_diurno) AS concluintes_diurno,
    SUM(cc.qt_conc_noturno) AS concluintes_noturno,
    SUM(cc.qt_mat_diurno) AS matriculas_diurno,
    SUM(cc.qt_mat_noturno) AS matriculas_noturno
FROM 
    curso_censo cc 
WHERE 
    cc.municipio = '4204202' 
    AND cc.ano_censo >= 2014 
    AND cc.ano_censo <= 2023
GROUP BY 
    cc.ano_censo 
ORDER BY 
    cc.ano_censo;
"""

try:
    # Conectar ao banco de dados
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Executar a consulta
    cursor.execute(sql_discentes_turno)
    resultados = cursor.fetchall()
    
    # Obter nomes das colunas
    colunas = [description[0] for description in cursor.description]
    
    # Converter para lista de dicionários
    dados = []
    for linha in resultados:
        dados.append(dict(zip(colunas, linha)))
    
    # Preparar dados para o JSON
    dados_json = {
        "anos": [item['ano'] for item in dados],
        "ingressantes_diurno": [item['ingressantes_diurno'] for item in dados],
        "ingressantes_noturno": [item['ingressantes_noturno'] for item in dados],
        "concluintes_diurno": [item['concluintes_diurno'] for item in dados],
        "concluintes_noturno": [item['concluintes_noturno'] for item in dados],
        "matriculas_diurno": [item['matriculas_diurno'] for item in dados],
        "matriculas_noturno": [item['matriculas_noturno'] for item in dados]
    }
    
    # Salvar no arquivo JSON
    with open('dados_discentes_turno.json', 'w', encoding='utf-8') as f:
        json.dump(dados_json, f, ensure_ascii=False, indent=2)
    
    print("\nDados salvos em 'dados_discentes_turno.json'")
    print(f"Total de anos: {len(dados_json['anos'])}")
    print(f"Período: {min(dados_json['anos'])} - {max(dados_json['anos'])}")
    
except sqlite3.Error as e:
    print(f"Erro no banco de dados: {e}")
except Exception as e:
    print(f"Erro geral: {e}")
finally:
    if conn:
        conn.close()
        print("Conexão com o banco fechada.")