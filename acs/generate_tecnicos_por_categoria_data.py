
import json
import pandas as pd
from sqlalchemy import create_engine, text

# Conectar ao banco de dados SQLite
engine = create_engine('sqlite:///D:/ProjetosPY/inep/INEP.db')

# Query para extrair os dados dos técnicos administrativos por categoria
query = """
SELECT
    i.ano_censo AS ano,
    i.categoria,
    SUM(i.qt_tec_total) AS total_tecnicos,
    SUM(i.qt_tec_doutorado_fem + i.qt_tec_especializacao_fem + i.qt_tec_fundamental_comp_fem + i.qt_tec_fundamental_incomp_fem + i.qt_tec_mestrado_fem + i.qt_tec_medio_fem + i.qt_tec_superior_fem) AS femininos,
    SUM(i.qt_tec_doutorado_masc + i.qt_tec_especializacao_masc + i.qt_tec_fundamental_comp_masc + i.qt_tec_fundamental_incomp_masc + i.qt_tec_mestrado_masc + i.qt_tec_medio_masc + i.qt_tec_superior_masc) AS masculinos,
    SUM(i.qt_tec_doutorado_fem + i.qt_tec_doutorado_masc) doutores,
    SUM(i.qt_tec_mestrado_fem + i.qt_tec_mestrado_masc) mestres,
    SUM(i.qt_tec_especializacao_fem + i.qt_tec_especializacao_masc) especialistas,
    SUM(i.qt_tec_superior_fem + i.qt_tec_superior_masc) superior,
    SUM(i.qt_tec_medio_fem + i.qt_tec_medio_masc) medio,
    SUM(i.qt_tec_fundamental_comp_fem + i.qt_tec_fundamental_comp_masc) fundamental,
    SUM(i.qt_tec_fundamental_incomp_fem + i.qt_tec_fundamental_incomp_masc) fundamental_incompleto
FROM
    ies_censo i
WHERE
    i.municipio = 4204202 and i.ano_censo > 2013
GROUP BY
    i.ano_censo, i.categoria
ORDER BY
    i.ano_censo, i.categoria;
"""

# Query para obter os nomes das categorias administrativas
query_categorias = """
SELECT
    codigo,
    nome
FROM
    tp_categoria_administrativa;
"""

# Executar a query principal e carregar os dados em um DataFrame
with engine.connect() as connection:
    df_data = pd.read_sql(text(query), connection)
    df_categorias = pd.read_sql(text(query_categorias), connection)

# Mapear códigos de categoria para nomes
category_map = df_categorias.set_index('codigo')['nome'].to_dict()

# Agrupar os dados por categoria e salvar em arquivos JSON separados
for categoria_code, group_df in df_data.groupby('categoria'):
    category_name = category_map.get(categoria_code, f'Categoria {categoria_code}')
    
    # Substituir espaços e caracteres especiais para nome de arquivo
    file_name = category_name.lower().replace(' ', '_').replace('-', '').replace('/', '')
    
    data_to_save = {
        'anos': group_df['ano'].tolist(),
        'total_tecnicos': group_df['total_tecnicos'].tolist(),
        'femininos': group_df['femininos'].tolist(),
        'masculinos': group_df['masculinos'].tolist(),
        'doutores': group_df['doutores'].tolist(),
        'mestres': group_df['mestres'].tolist(),
        'especialistas': group_df['especialistas'].tolist(),
        'superior': group_df['superior'].tolist(),
        'medio': group_df['medio'].tolist(),
        'fundamental': group_df['fundamental'].tolist(),
        'fundamental_incompleto': group_df['fundamental_incompleto'].tolist()
    }

    output_path = f'D:/ProjetosPY/inep/acs/dados_tecnicos_categoria_{file_name}.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data_to_save, f, ensure_ascii=False, indent=4)

print("Dados dos técnicos administrativos por categoria gerados com sucesso!")
