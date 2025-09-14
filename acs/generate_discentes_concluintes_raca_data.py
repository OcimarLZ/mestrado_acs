import json
import os
import sys
from sqlalchemy import text

# Adiciona a raiz do projeto ao sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from bdados.ler_bdados_to_df import carregar_dataframe

def generate_data():
    """
    Gera os dados para o gráfico de análise do perfil discente por raça e cor (concluintes) em Chapecó.
    """
    
    query = """
        SELECT 
            cc.ano_censo AS ano,
            SUM(cc.qt_conc_branca) AS branca,
            SUM(cc.qt_conc_parda) AS parda,
            SUM(cc.qt_conc_preta) AS preta,
            SUM(cc.qt_conc_indigena) AS indigena,
            SUM(cc.qt_conc_amarela) AS amarela,
            SUM(cc.qt_conc_cornd) AS naodeclarada
        FROM 
            curso_censo cc
        WHERE 
            cc.municipio = 4204202 AND cc.ano_censo > 2013
        GROUP BY 
            cc.ano_censo 
        ORDER BY 
            cc.ano_censo
    """
    
    df = carregar_dataframe(query)
    
    data = df.to_dict(orient='records')
    
    output_path = os.path.join(os.path.dirname(__file__), 'dados_discentes_concluintes_raca.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

if __name__ == '__main__':
    generate_data()
    print("Dados gerados com sucesso em dados_discentes_concluintes_raca.json")

