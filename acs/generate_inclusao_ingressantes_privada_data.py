import pandas as pd
from sqlalchemy import create_engine
import os
import json

# Configuração do banco de dados
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'INEP.db'))
DATABASE_URL = f"sqlite:///{DB_PATH}"

# Criar a engine do SQLAlchemy
engine = create_engine(DATABASE_URL)

# Query SQL para extrair dados de ingressantes por políticas de inclusão - Rede Privada
query = """
SELECT 
    cc.ano_censo AS ano, 
    r.nome as tipo_rede, 
    SUM(cc.qt_ing_apoio_social) AS apoio_social, 
    SUM(cc.qt_ing_deficiente) AS deficientes, 
    SUM(cc.qt_ing_reserva_vaga) as reserva_vagas, 
    SUM(cc.qt_ing_rvsocial_rf) AS reserva_social, 
    SUM(cc.qt_ing_rvetnico) AS reserva_etnica 
FROM 
    curso_censo cc 
JOIN 
    tp_rede r on r.codigo = cc.tp_rede 
WHERE 
    cc.municipio = 4204202 and cc.ano_censo > 2013 and cc.tp_rede = 2
GROUP BY 
    cc.ano_censo, r.nome 
ORDER BY 
    cc.ano_censo, r.nome
"""

# Executar a query e carregar os dados em um DataFrame
df = pd.read_sql(query, engine)

# Engine será fechada automaticamente

# Processar dados para o formato JSON
anos = sorted(df['ano'].unique())

# Criar datasets para cada categoria
datasets = [
    {
        'label': 'Apoio social',
        'data': [int(df[df['ano'] == ano]['apoio_social'].iloc[0]) if len(df[df['ano'] == ano]) > 0 else 0 for ano in anos]
    },
    {
        'label': 'Deficientes',
        'data': [int(df[df['ano'] == ano]['deficientes'].iloc[0]) if len(df[df['ano'] == ano]) > 0 else 0 for ano in anos]
    },
    {
        'label': 'Reserva vagas',
        'data': [int(df[df['ano'] == ano]['reserva_vagas'].iloc[0]) if len(df[df['ano'] == ano]) > 0 else 0 for ano in anos]
    },
    {
        'label': 'Reserva social',
        'data': [int(df[df['ano'] == ano]['reserva_social'].iloc[0]) if len(df[df['ano'] == ano]) > 0 else 0 for ano in anos]
    },
    {
        'label': 'Reserva étnica',
        'data': [int(df[df['ano'] == ano]['reserva_etnica'].iloc[0]) if len(df[df['ano'] == ano]) > 0 else 0 for ano in anos]
    }
]

# Estruturar dados finais
data = {
    'anos': [str(ano) for ano in anos],
    'datasets': datasets
}

# Salvar como JSON
with open('dados_inclusao_ingressantes_privada.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Arquivo dados_inclusao_ingressantes_privada.json gerado com sucesso!")
print(f"Anos: {anos}")
print(f"Datasets: {len(datasets)} categorias")