import os
import json

# --- Population Data and Growth Rate Calculation ---
pop_2010 = 183548
pop_2022 = 254781
pop_18_24_2022 = 25993
anos_crescimento = 12

# Calcular a taxa de crescimento anual
taxa_crescimento_anual = (pop_2022 / pop_2010)**(1 / anos_crescimento) - 1

# --- Population Estimation ---
anos = list(range(2014, 2025))
populacao_total_estimada = {}
populacao_18_24_estimada = {}

# Estimar a população para cada ano
for ano in anos:
    # Total population
    anos_diff_total = ano - 2010
    populacao_total_estimada[ano] = int(pop_2010 * ((1 + taxa_crescimento_anual) ** anos_diff_total))

    # 18-24 population
    anos_diff_18_24 = ano - 2022
    populacao_18_24_estimada[ano] = int(pop_18_24_2022 * ((1 + taxa_crescimento_anual) ** anos_diff_18_24))


# --- JSON Output ---
data = {
    'anos': list(populacao_total_estimada.keys()),
    'populacao_total': list(populacao_total_estimada.values()),
    'populacao_18_24': list(populacao_18_24_estimada.values())
}

output_json_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'dados_populacao_chapeco.json'))

with open(output_json_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"JSON dos dados gerado em: {output_json_path}")