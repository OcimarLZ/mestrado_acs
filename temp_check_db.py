import pandas as pd
from sqlalchemy import create_engine
import os

# Configuração do banco de dados
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'INEP.db'))
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Criar a engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# Query SQL para a população de 18 a 24 anos
SQL_POP_18_24 = """
SELECT
    ano_censo,
    pop_19a24anos
FROM
    municipio_censo
WHERE
    municipio = '4204202'
ORDER BY
    ano_censo;
"""

# Executar a query e carregar os dados em um DataFrame
df_pop_18_24 = pd.read_sql(SQL_POP_18_24, engine)

print(df_pop_18_24)
