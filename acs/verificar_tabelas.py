import sqlite3

# Conectar ao banco de dados
conn = sqlite3.connect('INEP.db')
cursor = conn.cursor()

# Listar todas as tabelas
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()

print('Tabelas disponíveis:')
for table in tables:
    print(f'- {table[0]}')

# Verificar se existe alguma tabela relacionada a cursos
print('\nTabelas que contêm "curso" no nome:')
for table in tables:
    if 'curso' in table[0].lower():
        print(f'- {table[0]}')

conn.close()