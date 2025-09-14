import pandas as pd
import sys
import os
import json

# Adiciona a raiz do projeto ao sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from bdados.ler_bdados_to_df import carregar_dataframe

# Parâmetros
ANO_INICIAL = 2014
ANO_FINAL = 2023
MUNICIPIO_CODIGO = '4204202' # Chapecó

# SQL para buscar os dados anuais de cada IES
sql = f"""
SELECT 
    i.nome AS nome_ies,
    i.sigla AS sigla_ies,
    cc.ano_censo,
    cc.tp_modalidade_ensino
FROM 
    curso_censo cc
JOIN 
    ies i ON cc.ies = i.codigo
WHERE 
    cc.municipio = {MUNICIPIO_CODIGO} AND cc.ano_censo BETWEEN {ANO_INICIAL} AND {ANO_FINAL}
ORDER BY 
    i.nome, cc.ano_censo;
"""

def gerar_dados_timeline_ies():
    """
    Busca e processa dados para criar uma timeline da atividade das IES.
    """
    data = carregar_dataframe(sql)
    if data.empty:
        return []

    data['sigla_ies'] = data['sigla_ies'].fillna('-')
    data['modalidade'] = data['tp_modalidade_ensino'].map({1: 'Presencial', 2: 'A Distância'})

    # Agrupar para obter a timeline de cada IES
    agg_funcs = {
        'ano_censo': ['min', 'max'],
        'modalidade': lambda x: ', '.join(sorted(x.unique()))
    }
    df_timeline = data.groupby(['nome_ies', 'sigla_ies']).agg(agg_funcs).reset_index()

    # Aplainar os nomes das colunas do MultiIndex
    df_timeline.columns = ['nome', 'sigla', 'ano_inicio', 'ano_fim', 'modalidades']

    # Adicionar status
    df_timeline['status'] = df_timeline['ano_fim'].apply(lambda x: 'Ativa' if x == ANO_FINAL else f'Inativa desde {x}')
    
    return df_timeline.to_dict(orient='records')

if __name__ == '__main__':
    dados_timeline = gerar_dados_timeline_ies()
    
    output_path = os.path.join(os.path.dirname(__file__), 'dados_ies_timeline.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(dados_timeline, f, ensure_ascii=False, indent=4)
    
    print(f"Dados de timeline de {len(dados_timeline)} IES salvos em {output_path}")
