import pandas as pd
from sqlalchemy import create_engine
import os
import sys

# Adicionar o diretório raiz do projeto ao sys.path para importar utilities
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Configuração do banco de dados (do config.ini)
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'INEP.db'))
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Criar a engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# SQL para a primeira tabela (resumo das 30 menores IES)
SQL_QUERY_RESUMO = """
WITH IES_Piores_Matriculas AS (
    SELECT
        cc.ies,
        SUM(cc.qt_mat) AS total_matriculas_periodo,
        COUNT(DISTINCT cc.ano_censo) AS anos_ativos,
        CAST(SUM(cc.qt_mat) AS REAL) / COUNT(DISTINCT cc.ano_censo) AS media_matriculas_anual
    FROM
        curso_censo cc
    WHERE
        cc.municipio = 4204202
        AND cc.ano_censo BETWEEN 2014 AND 2024
        AND cc.ies NOT IN (15121, 82, 3151, 298, 1472)
    GROUP BY
        cc.ies
    HAVING
        anos_ativos > 0
    ORDER BY
        total_matriculas_periodo ASC
    LIMIT 30
)
SELECT
    i.nome AS nome_instituicao,
    COUNT(DISTINCT cc.ano_censo) AS anos_ofertados,
    SUM(cc.qt_mat) AS total_matriculas_periodo,
    COUNT(DISTINCT cc.curso) AS total_cursos_ofertados
FROM
    curso_censo cc
JOIN
    IES_Piores_Matriculas ipm ON cc.ies = ipm.ies
JOIN
    ies i ON cc.ies = i.codigo
WHERE
    cc.municipio = 4204202
    AND cc.ano_censo BETWEEN 2014 AND 2024
GROUP BY
    cc.ies, i.nome
ORDER BY
    total_matriculas_periodo DESC;
"""

df_resumo = pd.read_sql(SQL_QUERY_RESUMO, engine)

# Calcular média anual de matrículas e cursos ofertados
df_resumo['media_matriculas_anual'] = df_resumo['total_matriculas_periodo'] / df_resumo['anos_ofertados']
df_resumo['media_cursos_ofertados_anual'] = df_resumo['total_cursos_ofertados'] / df_resumo['anos_ofertados']

# Selecionar e reordenar colunas para a saída final
df_resumo_final = df_resumo[['nome_instituicao', 'anos_ofertados', 'media_matriculas_anual', 'media_cursos_ofertados_anual']]

# Caminho para salvar o JSON
output_json_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'dados'))
os.makedirs(output_json_dir, exist_ok=True)
output_json_path_resumo = os.path.join(output_json_dir, 'menores_ies_resumo.json')

with open(output_json_path_resumo, 'w', encoding='utf-8') as f:
    df_resumo_final.to_json(f, orient='records', indent=4)

print(f"Dados de resumo das menores IES gerados em: {output_json_path_resumo}")

# Caminho para salvar o Excel (opcional)
output_excel_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'static', 'tabelas'))
os.makedirs(output_excel_dir, exist_ok=True)
output_excel_path_resumo = os.path.join(output_excel_dir, 'menores_ies_resumo.xlsx')
df_resumo_final.to_excel(output_excel_path_resumo, index=False)

print(f"Excel de resumo das menores IES gerado em: {output_excel_path_resumo}")
