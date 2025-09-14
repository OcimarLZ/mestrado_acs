import pandas as pd
from sqlalchemy import create_engine
import os
import json
import numpy as np

# --- Population Data and Growth Rate Calculation ---
pop_2010 = 183548
pop_2022 = 254781
pop_18_24_2022 = 25993
anos_crescimento = 12

# Calcular a taxa de crescimento anual
taxa_crescimento_anual = (pop_2022 / pop_2010)**(1 / anos_crescimento) - 1

# --- Database Connection ---
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'INEP.db'))
DATABASE_URL = f"sqlite:///{DB_PATH}"
engine = create_engine(DATABASE_URL)

# --- SQL Queries ---
# Query SQL para matrículas totais
SQL_MAT_TOTAL = """
SELECT
    ano_censo,
    SUM(qt_mat) as total_matriculas
FROM
    curso_censo
WHERE
    municipio = 4204202 AND ano_censo BETWEEN 2014 AND 2023
GROUP BY
    ano_censo
ORDER BY
    ano_censo;
"""

# Query SQL para matrículas na faixa etária de 18 a 24 anos
SQL_MAT_18_24 = """
SELECT
    ano_censo,
    SUM(qt_mat_18_24) as matriculas_18_24
FROM
    curso_censo
WHERE
    municipio = 4204202 AND ano_censo BETWEEN 2014 AND 2023
GROUP BY
    ano_censo
ORDER BY
    ano_censo;
"""

# --- Data Fetching and Processing ---
df_mat_total = pd.read_sql(SQL_MAT_TOTAL, engine)
df_mat_18_24 = pd.read_sql(SQL_MAT_18_24, engine)

# Merge enrollment data
df = pd.merge(df_mat_total, df_mat_18_24, on='ano_censo', how='outer')

# --- Population Estimation ---
anos = list(range(2014, 2024))
pop_18_24_estimada = {}

# Estimar a população para cada ano
for ano in anos:
    if ano == 2022:
        pop_18_24_estimada[ano] = pop_18_24_2022
    else:
        anos_diff = ano - 2022
        pop_18_24_estimada[ano] = int(pop_18_24_2022 * ((1 + taxa_crescimento_anual) ** anos_diff))

df_pop = pd.DataFrame(list(pop_18_24_estimada.items()), columns=['ano_censo', 'pop_18_24'])

# Merge population data with enrollment data
df = pd.merge(df, df_pop, on='ano_censo', how='left')

# --- Rate Calculation ---
df['taxa_bruta'] = (df['total_matriculas'] / df['pop_18_24']) * 100
df['taxa_liquida'] = (df['matriculas_18_24'] / df['pop_18_24']) * 100

# --- JSON Output ---
data = {
    'anos': df['ano_censo'].tolist(),
    'taxa_bruta': df['taxa_bruta'].round(2).tolist(),
    'taxa_liquida': df['taxa_liquida'].round(2).tolist(),
    'meta_bruta': [50] * len(df),
    'meta_liquida': [33] * len(df)
}

output_json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'dados_meta12_pne.json'))

with open(output_json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"JSON dos dados gerado em: {output_json_path}")