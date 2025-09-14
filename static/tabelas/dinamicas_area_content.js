const dinamicasAreaContent = `<html><head><meta charset='UTF-8'>
        <style>
            table {width: 100%; border-collapse: collapse;}
            th { background-color: #4CAF50; color: white; font-size: 12px; font-family: Tahoma, sans-serif; background-color: #4CAF50; color: white;}
            td {font-size: 10px; font-family: Tahoma, sans-serif;}
            tr:nth-child(even) {background-color: #f2f2f2;}
            tr:hover {background-color: #ddd;}
            .left {text-align: left;}
            .center {text-align: center;}
            .right {text-align: right;}
        </style>
        </head><body><table border='1'><tr><th class='left' style='width: 250px;'>Área de Conhecimento</th><th class='right' style='width: 150px;'>Matriculados</th><th class='right' style='width: 150px;'>Concluintes</th></tr><tr><td class='left'>Administração</td><td class='right'>2,743,121</td><td class='right'>464,537</td></tr><tr><td class='left'>Saúde</td><td class='right'>2,239,337</td><td class='right'>267,325</td></tr><tr><td class='left'>Educação</td><td class='right'>1,734,140</td><td class='right'>233,941</td></tr><tr><td class='left'>Engenharias</td><td class='right'>892,728</td><td class='right'>119,074</td></tr><tr><td class='left'>Informática</td><td class='right'>724,485</td><td class='right'>80,316</td></tr><tr><td class='left'>Sociais</td><td class='right'>568,943</td><td class='right'>70,070</td></tr><tr><td class='left'>Agrárias</td><td class='right'>349,597</td><td class='right'>37,507</td></tr><tr><td class='left'>Serviços</td><td class='right'>293,630</td><td class='right'>47,303</td></tr><tr><td class='left'>Artes</td><td class='right'>254,521</td><td class='right'>39,934</td></tr><tr><td class='left'>Naturais</td><td class='right'>128,240</td><td class='right'>14,781</td></tr><tr><td class='left'>Indefinida</td><td class='right'>48,464</td><td class='right'>0</td></tr></table></body></html>
    <div class="row justify-content-center mt-4">
        <div class="col-lg-10 col-xl-8">
            <p class="text-justify chart-commentary">A análise da distribuição de matriculados e concluintes por área de conhecimento revela tendências importantes sobre as escolhas dos estudantes e as demandas do mercado de trabalho.</p>
            <p class="text-justify chart-commentary mt-3">Observa-se uma concentração significativa em áreas como 'Administração', 'Saúde' e 'Educação', refletindo tanto a alta demanda por profissionais nestes setores quanto o apelo popular de carreiras consolidadas como administração, direito, medicina, enfermagem e pedagogia. A área de 'Informática' (Computação e TIC) também se destaca, impulsionada pela transformação digital e a crescente necessidade de especialistas em tecnologia.</p>
            <p class="text-justify chart-commentary mt-3">As licenciaturas, concentradas majoritariamente na área de 'Educação', continuam a ser fundamentais para a formação de professores, base de todo o sistema educacional. Apesar dos desafios de valorização da carreira docente, a procura por esses cursos permanece robusta, indicando um contingente expressivo de estudantes que optam pela carreira da educação.</p>
            <p class="text-justify chart-commentary mt-3">Áreas como 'Engenharias' e 'Sociais' (incluindo direito e comunicação) mantêm uma procura estável, enquanto 'Naturais', 'Agrárias' e 'Artes' apresentam um número menor de estudantes, o que pode indicar nichos de mercado mais específicos ou uma menor procura geral por estas formações.</p>
        </div>
    </div>
    `;

document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('dinamicas-area-container');
    if (container) {
        container.innerHTML = dinamicasAreaContent;
    }
});