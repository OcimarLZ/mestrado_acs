import sqlite3
import json
import os

# Caminho para o banco de dados
db_path = os.path.join(os.path.dirname(__file__), '..', 'INEP.db')
print(f"Conectando ao banco: {db_path}")

# SQL para obter dados de discentes por gênero (2014-2023)
sql_discentes_genero = """
SELECT 
    cc.ano_censo AS ano,
    SUM(cc.qt_ing_masc) AS ingressos_masc, 
    SUM(cc.qt_ing_fem) AS ingressos_fem, 
    SUM(cc.qt_mat_masc) AS matriculas_masc,
    SUM(cc.qt_mat_fem) AS matriculas_fem,
    SUM(cc.qt_conc_masc) AS concluintes_masc,
    SUM(cc.qt_conc_fem) AS concluintes_fem
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
    cursor.execute(sql_discentes_genero)
    resultados = cursor.fetchall()
    
    # Obter nomes das colunas
    colunas = [description[0] for description in cursor.description]
    
    # Converter para lista de dicionários
    dados = []
    for linha in resultados:
        registro = dict(zip(colunas, linha))
        dados.append(registro)
    
    print("Dados obtidos do banco INEP.db:")
    for registro in dados:
        print(f"Ano {registro['ano']}: Ingressos M/F: {registro['ingressos_masc']}/{registro['ingressos_fem']}, "
              f"Matrículas M/F: {registro['matriculas_masc']}/{registro['matriculas_fem']}, "
              f"Concluintes M/F: {registro['concluintes_masc']}/{registro['concluintes_fem']}")
    
    # Salvar em arquivo JSON
    with open('dados_discentes_genero_chapeco.json', 'w', encoding='utf-8') as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    
    print("\nDados salvos em 'dados_discentes_genero_chapeco.json'")
    
except sqlite3.Error as e:
    print(f"Erro ao acessar o banco de dados: {e}")
except Exception as e:
    print(f"Erro geral: {e}")
finally:
    if conn:
        conn.close()