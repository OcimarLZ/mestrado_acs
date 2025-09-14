import pandas as pd
import sys
import os

# Adiciona a raiz do projeto ao sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from bdados.ler_bdados_to_df import carregar_dataframe
import json

# Parâmetros do Filtro
ANO_INICIAL = 2014
MUNICIPIO_CODIGO = '4204202' # Chapecó

# SQL para buscar os dados das IES
sql = f"""
SELECT 
    i.nome AS nome_ies,
    i.sigla AS sigla_ies,
    ca.nome AS categoria_administrativa,
    CASE 
        WHEN cc.tp_modalidade_ensino = 1 THEN 'Presencial'
        WHEN cc.tp_modalidade_ensino = 2 THEN 'A Distância'
    END AS modalidade
FROM 
    curso_censo cc
JOIN 
    ies i ON cc.ies = i.codigo
JOIN 
    tp_categoria_administrativa ca ON i.categoria = ca.codigo
WHERE 
    cc.municipio = {MUNICIPIO_CODIGO} AND cc.ano_censo >= {ANO_INICIAL}
ORDER BY 
    i.nome;
"""

def gerar_dados_ies():
    """
    Busca, processa e retorna os dados das IES em formato JSON.
    """
    # Carregar dados do banco
    data = carregar_dataframe(sql)

    # Substituir valores nulos em sigla_ies por "-"
    data['sigla_ies'] = data['sigla_ies'].fillna('-')

    # Agrupar por IES, sigla e categoria, concatenando as modalidades de ensino
    df_agrupado = (data.groupby(['nome_ies', 'sigla_ies', 'categoria_administrativa'])['modalidade']
          .apply(lambda x: ', '.join(sorted(set(x))))
          .reset_index())

    # Renomear colunas
    df_agrupado.columns = ['nome', 'sigla', 'categoria', 'modalidades']

    # Converter para dicionário
    return df_agrupado.to_dict(orient='records')

def gerar_dados_mantenedoras_ies():
    """
    Busca, processa e retorna os dados das mantenedoras e suas IES em Chapecó em formato JSON.
    """
    sql_mantenedoras = f"""
    SELECT
        m.nome AS nome_mantenedora,
        i.nome AS nome_ies
    FROM
        mantenedora m
    JOIN
        ies i ON i.mantenedora = m.codigo
    JOIN
        curso_censo cc ON cc.ies = i.codigo
    WHERE
        cc.municipio = '{MUNICIPIO_CODIGO}' AND cc.ano_censo >= {ANO_INICIAL}
    GROUP BY
        m.nome, i.nome
    ORDER BY
        m.nome, i.nome;
    """

    data = carregar_dataframe(sql_mantenedoras)

    # Agrupar IES por mantenedora
    mantenedoras_agrupadas = {}
    for _, row in data.iterrows():
        mantenedora = row['nome_mantenedora']
        ies = row['nome_ies']
        if mantenedora not in mantenedoras_agrupadas:
            mantenedoras_agrupadas[mantenedora] = []
        mantenedoras_agrupadas[mantenedora].append(ies)

    # Formatar para JSON
    resultado = []
    for mantenedora, ies_list in mantenedoras_agrupadas.items():
        resultado.append({
            'mantenedora': mantenedora,
            'ies': sorted(ies_list) # Ordenar as IES para consistência
        })

    return resultado

def gerar_dados_ranking_matriculas():
    """
    Busca, processa e retorna os dados do ranking das 10 maiores IES por número de matrículas
    em Chapecó para os anos de 2014, 2019 e 2023 em formato JSON, com matrículas separadas por ano.
    """
    sql_ranking = f"""
    SELECT
        i.nome AS nome_ies,
        cc.ano_censo,
        SUM(cc.qt_mat) AS total_matriculas
    FROM
        ies i
    JOIN
        curso_censo cc ON cc.ies = i.codigo
    WHERE
        cc.municipio = '{MUNICIPIO_CODIGO}' AND cc.ano_censo IN (2014, 2019, 2023)
    GROUP BY
        i.nome, cc.ano_censo
    ORDER BY
        i.nome, cc.ano_censo;
    """

    data = carregar_dataframe(sql_ranking)

    # Pivotar os dados para ter 2014, 2019 e 2023 como colunas
    df_pivot = data.pivot_table(index='nome_ies', columns='ano_censo', values='total_matriculas').fillna(0)
    df_pivot.columns = [f'matriculas_{col}' for col in df_pivot.columns]
    df_pivot = df_pivot.reset_index()

    # Calcular o total geral para ordenar e pegar as 10 maiores
    df_pivot['total_geral'] = df_pivot['matriculas_2014'] + df_pivot['matriculas_2019'] + df_pivot['matriculas_2023']
    df_pivot = df_pivot.sort_values(by='total_geral', ascending=False).head(10)

    # Converter para dicionário
    return df_pivot.to_dict(orient='records')

if __name__ == '__main__':
    try:
        # Gerar os dados das IES (existente)
        dados_ies = gerar_dados_ies()
        output_path_ies = os.path.join(os.path.dirname(__file__), 'dados_ies.json')
        with open(output_path_ies, 'w', encoding='utf-8') as f:
            json.dump(dados_ies, f, ensure_ascii=False, indent=4)
        print(f"Dados de {len(dados_ies)} IES salvos em {output_path_ies}")

        # Gerar os dados das mantenedoras e IES (novo)
        dados_mantenedoras_ies = gerar_dados_mantenedoras_ies()
        output_path_mantenedoras = os.path.join(os.path.dirname(__file__), 'dados_mantenedoras_ies.json')
        with open(output_path_mantenedoras, 'w', encoding='utf-8') as f:
            json.dump(dados_mantenedoras_ies, f, ensure_ascii=False, indent=4)
        print(f"Dados de {len(dados_mantenedoras_ies)} mantenedoras e IES salvos em {output_path_mantenedoras}")

        # Gerar os dados do ranking de matrículas (novo)
        dados_ranking_matriculas = gerar_dados_ranking_matriculas()
        output_path_ranking = os.path.join(os.path.dirname(__file__), 'dados_ranking_matriculas.json')
        with open(output_path_ranking, 'w', encoding='utf-8') as f:
            json.dump(dados_ranking_matriculas, f, ensure_ascii=False, indent=4)
        print(f"Dados de {len(dados_ranking_matriculas)} IES no ranking de matrículas salvos em {output_path_ranking}")
    except Exception as e:
        print(f"Ocorreu um erro durante a geração dos dados: {e}")