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
    r.nome as tipo_rede, 
    SUM(cc.qt_mat_apoio_social) AS apoio_social, 
    SUM(cc.qt_mat_deficiente) AS deficientes, 
    SUM(cc.qt_mat_reserva_vaga) as reserva_vagas, 
    SUM(cc.qt_mat_rvsocial_rf) AS reserva_social, 
    SUM(cc.qt_mat_rvetnico) AS reserva_etnica 
FROM 
    curso_censo cc 
JOIN 
    tp_rede r on r.codigo = cc.tp_rede 
WHERE 
    cc.municipio = 4204202 and cc.ano_censo > 2013 
GROUP BY 
    cc.ano_censo, r.nome 
ORDER BY 
    cc.ano_censo, r.nome
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
redes = sorted(df['tipo_rede'].unique().tolist())

# Preparar dados para o JSON
data = {
    'anos': anos,
    'redes': redes,
    'datasets': []
}

# Criar datasets para cada variável
variaveis = {
    'apoio_social': 'Apoio Social',
    'deficientes': 'Estudantes com Deficiência',
    'reserva_vagas': 'Reserva de Vagas (Total)',
    'reserva_social': 'Reserva Social',
    'reserva_etnica': 'Reserva Étnica'
}

# Cores para cada tipo de rede
cores_rede = {
    'Privada com fins lucrativos': '#FF6384',
    'Privada sem fins lucrativos': '#36A2EB',
    'Pública Federal': '#4BC0C0',
    'Especial': '#9966FF'
}

# Para cada variável, criar um dataset por tipo de rede
for var_key, var_name in variaveis.items():
    for rede in redes:
        # Filtrar dados para esta rede
        rede_data = df[df['tipo_rede'] == rede]
        
        # Criar array de valores para cada ano
        valores = []
        for ano in anos:
            valor = rede_data[rede_data['ano'] == ano][var_key].values
            valores.append(int(valor[0]) if len(valor) > 0 else 0)
        
        # Adicionar dataset
        data['datasets'].append({
            'label': f"{var_name} - {rede}",
            'data': valores,
            'variavel': var_key,
            'rede': rede,
            'backgroundColor': cores_rede.get(rede, '#000000'),
            'borderColor': cores_rede.get(rede, '#000000'),
            'fill': False
        })

# Criar diretório se não existir
output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'static', 'dados')
os.makedirs(output_dir, exist_ok=True)

# Salvar como JSON
output_file = os.path.join(output_dir, 'dados_perspectiva_social.json')
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"Dados salvos em: {output_file}")

# Gerar também um arquivo Excel para download
excel_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'static', 'tabelas')
os.makedirs(excel_dir, exist_ok=True)
excel_file = os.path.join(excel_dir, 'perspectiva_social.xlsx')

# Criar um DataFrame mais amigável para Excel
excel_data = []
for ano in anos:
    for rede in redes:
        row_data = {'Ano': ano, 'Tipo de Rede': rede}
        rede_df = df[(df['ano'] == ano) & (df['tipo_rede'] == rede)]
        if not rede_df.empty:
            for var_key, var_name in variaveis.items():
                row_data[var_name] = int(rede_df[var_key].values[0])
        else:
            for var_name in variaveis.values():
                row_data[var_name] = 0
        excel_data.append(row_data)

excel_df = pd.DataFrame(excel_data)
excel_df.to_excel(excel_file, index=False)
print(f"Arquivo Excel gerado em: {excel_file}")