import os
import json
import sqlite3
import pandas as pd
import numpy as np
import sys
import os

# Adicionar o diretório pai ao path para importar módulos
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configuração do banco de dados
db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'inep.db')

# Verificar se o banco de dados existe
if not os.path.exists(db_path):
    print(f"Banco de dados não encontrado: {db_path}")
    sys.exit(1)

# Conectar ao banco de dados
conn = sqlite3.connect(db_path)
print(f"Conectado ao banco de dados: {db_path}")

# Executar a consulta SQL
query = """
SELECT 
    cc.ano_censo AS ano, 
    SUM(cc.qt_ing_apoio_social) AS apoio_social, 
    SUM(cc.qt_ing_deficiente) AS deficientes, 
    SUM(cc.qt_ing_reserva_vaga) as reserva_vagas, 
    SUM(cc.qt_ing_rvsocial_rf) AS reserva_social, 
    SUM(cc.qt_ing_rvetnico) AS reserva_etnica 
FROM 
    curso_censo cc 
WHERE 
    cc.municipio = 4204202 and cc.ano_censo > 2013 
GROUP BY 
    cc.ano_censo 
ORDER BY 
    cc.ano_censo
"""

# Carregar os dados em um DataFrame
df = pd.read_sql_query(query, conn)
print("Consulta executada com sucesso")

# Fechar a conexão com o banco de dados
conn.close()

# Substituir valores NaN por 0
df = df.fillna(0)

# Converter para tipos numéricos
numeric_columns = ['apoio_social', 'deficientes', 'reserva_vagas', 'reserva_social', 'reserva_etnica']
for col in numeric_columns:
    df[col] = df[col].astype(int)

# Criar estrutura de dados para o JSON
anos = sorted(df['ano'].unique().tolist())

# Preparar dados para o JSON no formato esperado pelo gráfico
data = {
    'anos': anos,
    'datasets': {
        'APOIO_SOCIAL': df['apoio_social'].tolist(),
        'DEFICIENTES': df['deficientes'].tolist(),
        'RESERVA_VAGAS': df['reserva_vagas'].tolist(),
        'RESERVA_SOCIAL': df['reserva_social'].tolist(),
        'RESERVA_ETNICA': df['reserva_etnica'].tolist()
    }
}

# Salvar como JSON no diretório acs
output_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dados_discentes_inclusao.json')
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Dados salvos em: {output_file}")

# Gerar também um arquivo Excel para download
excel_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'static', 'tabelas')
os.makedirs(excel_dir, exist_ok=True)
excel_file = os.path.join(excel_dir, 'discentes_inclusao.xlsx')

# Criar um DataFrame mais amigável para Excel
excel_data = []
for i, ano in enumerate(anos):
    excel_data.append({
        'Ano': ano,
        'Apoio Social': data['datasets']['APOIO_SOCIAL'][i],
        'Estudantes com Deficiência': data['datasets']['DEFICIENTES'][i],
        'Reserva de Vagas': data['datasets']['RESERVA_VAGAS'][i],
        'Reserva Social': data['datasets']['RESERVA_SOCIAL'][i],
        'Reserva Étnica': data['datasets']['RESERVA_ETNICA'][i]
    })

excel_df = pd.DataFrame(excel_data)
excel_df.to_excel(excel_file, index=False)
print(f"Arquivo Excel gerado em: {excel_file}")

# Exibir resumo dos dados
print("\nResumo dos dados gerados:")
print(f"Período: {min(anos)} - {max(anos)}")
print(f"Total de anos: {len(anos)}")
for categoria in data['datasets']:
    total = sum(data['datasets'][categoria])
    print(f"{categoria}: {total} ingressantes no período")