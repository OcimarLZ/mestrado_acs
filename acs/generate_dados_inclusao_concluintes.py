#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para gerar dados de Discentes Concluintes A Partir de Políticas de Inclusão
Baseado na query SQL fornecida para o município de Chapecó (4204202)
"""

import sqlite3
import json
import os
from pathlib import Path

def conectar_banco():
    """Conecta ao banco de dados SQLite"""
    # Caminho para o banco INEP.db na pasta principal do projeto
    db_path = '../INEP.db'
    
    if os.path.exists(db_path):
        return sqlite3.connect(db_path)
    
    raise FileNotFoundError(f"Banco de dados 'INEP.db' não encontrado em {db_path}")

def gerar_dados_inclusao_concluintes():
    """Gera os dados de concluintes com políticas de inclusão"""
    
    # Query SQL fornecida
    query = """
    SELECT 
        cc.ano_censo AS ano, 
        SUM(cc.qt_conc_apoio_social) AS apoio_social, 
        SUM(cc.qt_conc_deficiente) AS deficientes, 
        SUM(cc.qt_conc_reserva_vaga) as reserva_vagas, 
        SUM(cc.qt_conc_rvsocial_rf) AS reserva_social, 
        SUM(cc.qt_conc_rvetnico) AS reserva_etnica 
    FROM 
        curso_censo cc 
    WHERE 
        cc.municipio = 4204202 and cc.ano_censo > 2013 
    GROUP BY 
        cc.ano_censo 
    ORDER BY 
        cc.ano_censo
    """
    
    try:
        # Conecta ao banco
        conn = conectar_banco()
        cursor = conn.cursor()
        
        # Executa a query
        cursor.execute(query)
        resultados = cursor.fetchall()
        
        # Processa os dados
        anos = []
        datasets = {
            'Apoio social': [],
            'Deficientes': [],
            'Reserva de vagas': [],
            'Reserva social': [],
            'Reserva étnica': []
        }
        
        for row in resultados:
            ano, apoio_social, deficientes, reserva_vagas, reserva_social, reserva_etnica = row
            
            anos.append(ano)
            datasets['Apoio social'].append(apoio_social or 0)
            datasets['Deficientes'].append(deficientes or 0)
            datasets['Reserva de vagas'].append(reserva_vagas or 0)
            datasets['Reserva social'].append(reserva_social or 0)
            datasets['Reserva étnica'].append(reserva_etnica or 0)
        
        # Estrutura final dos dados
        dados_finais = {
            'anos': anos,
            'datasets': datasets
        }
        
        # Salva no arquivo JSON
        output_file = 'dados_inclusao_concluintes.json'
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(dados_finais, f, ensure_ascii=False, indent=2)
        
        print(f"✓ Dados gerados com sucesso em '{output_file}'")
        print(f"✓ Anos encontrados: {anos}")
        print(f"✓ Total de registros: {len(anos)}")
        
        # Mostra um resumo dos dados
        print("\n=== RESUMO DOS DADOS ===")
        for categoria, valores in datasets.items():
            total = sum(valores)
            print(f"{categoria}: {total} (total)")
        
        conn.close()
        return True
        
    except sqlite3.Error as e:
        print(f"✗ Erro no banco de dados: {e}")
        return False
    except Exception as e:
        print(f"✗ Erro geral: {e}")
        return False

if __name__ == "__main__":
    print("=== Gerador de Dados: Discentes Concluintes - Políticas de Inclusão ===")
    print("Município: Chapecó (4204202)")
    print("Período: 2014 em diante")
    print()
    
    sucesso = gerar_dados_inclusao_concluintes()
    
    if sucesso:
        print("\n✓ Processo concluído com sucesso!")
    else:
        print("\n✗ Processo falhou. Verifique os erros acima.")