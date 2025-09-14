import sqlite3
import json
import os

# Caminho para o banco INEP.db
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'INEP.db'))

def gerar_dados_populacao_etnia():
    """
    Gera dados de população por etnia para Chapecó (código 4204202)
    baseado na consulta SQL fornecida
    """
    try:
        # Conectar ao banco de dados
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Consulta SQL fornecida
        query = """
        SELECT 
            mc.pop_ajustada as populacao, 
            mc.pop_branca, 
            mc.pop_parda, 
            mc.pop_preta, 
            (mc.pop_quilombola + mc.pop_quilombola_territorio) as quilombolas, 
            (mc.pop_indigena + mc.pop_indigena_territorio) as indigenas, 
            mc.pop_amarela 
        FROM municipio_censo mc 
        WHERE mc.municipio = '4204202'
        """
        
        cursor.execute(query)
        resultado = cursor.fetchone()
        
        if resultado:
            # Extrair dados do resultado
            populacao_total = resultado[0]
            pop_branca = resultado[1]
            pop_parda = resultado[2]
            pop_preta = resultado[3]
            quilombolas = resultado[4]
            indigenas = resultado[5]
            pop_amarela = resultado[6]
            
            # Calcular população não definida
            populacao_declarada = pop_branca + pop_parda + pop_preta + quilombolas + indigenas + pop_amarela
            populacao_nao_definida = populacao_total - populacao_declarada
            
            # Estruturar dados
            dados = {
                'populacao': populacao_total,
                'pop_branca': pop_branca,
                'pop_parda': pop_parda,
                'pop_preta': pop_preta,
                'quilombolas': quilombolas,
                'indigenas': indigenas,
                'pop_amarela': pop_amarela,
                'populacao_nao_definida': populacao_nao_definida
            }
            
            print(f"Dados obtidos do banco INEP.db:")
            print(f"População total: {populacao_total:,}")
            print(f"Branca: {pop_branca:,}")
            print(f"Parda: {pop_parda:,}")
            print(f"Preta: {pop_preta:,}")
            print(f"Quilombola: {quilombolas:,}")
            print(f"Indígena: {indigenas:,}")
            print(f"Amarela: {pop_amarela:,}")
            print(f"Não definida: {populacao_nao_definida:,}")
            
            # Salvar em arquivo JSON
            with open('dados_populacao_etnia_chapeco.json', 'w', encoding='utf-8') as f:
                json.dump(dados, f, ensure_ascii=False, indent=2)
            
            print(f"\nDados salvos em 'dados_populacao_etnia_chapeco.json'")
            
            return dados
            
        else:
            print("Nenhum dado encontrado para o município 4204202 (Chapecó)")
            return None
            
    except sqlite3.Error as e:
        print(f"Erro ao acessar o banco de dados: {e}")
        return None
    except Exception as e:
        print(f"Erro inesperado: {e}")
        return None
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    # Verificar se o banco existe
    if not os.path.exists(DB_PATH):
        print(f"Erro: Banco de dados não encontrado em {DB_PATH}")
    else:
        print(f"Conectando ao banco: {DB_PATH}")
        gerar_dados_populacao_etnia()