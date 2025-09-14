import pandas as pd
from sqlalchemy import create_engine
import os

# Configuração do banco de dados
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'INEP.db'))
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Criar a engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# Query SQL para matrículas totais em 2022
SQL_MAT_TOTAL_2022 = """
SELECT
    SUM(qt_mat) as total_matriculas
FROM
    curso_censo
WHERE
    municipio = 4204202 AND ano_censo = 2022;
"""

# Query SQL para matrículas na faixa etária de 18 a 24 anos em 2022
SQL_MAT_18_24_2022 = """
SELECT
    SUM(qt_mat_18_24) as matriculas_18_24
FROM
    curso_censo
WHERE
    municipio = 4204202 AND ano_censo = 2022;
"""

# Executar as queries
df_mat_total_2022 = pd.read_sql(SQL_MAT_TOTAL_2022, engine)
df_mat_18_24_2022 = pd.read_sql(SQL_MAT_18_24_2022, engine)

total_matriculas_2022 = df_mat_total_2022['total_matriculas'].iloc[0]
matriculas_18_24_2022 = df_mat_18_24_2022['matriculas_18_24'].iloc[0]

print(f"Total de matrículas em 2022: {total_matriculas_2022}")
print(f"Matrículas de 18 a 24 anos em 2022: {matriculas_18_24_2022}")

pop_18_24_2022 = 25993

taxa_bruta = (total_matriculas_2022 / pop_18_24_2022) * 100
taxa_liquida = (matriculas_18_24_2022 / pop_18_24_2022) * 100

print(f"Taxa Bruta Calculada: {taxa_bruta:.2f}%")
print(f"Taxa Líquida Calculada: {taxa_liquida:.2f}%")
