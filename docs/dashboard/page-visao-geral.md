# A1.7 — Dashboard de Monitoramento da Horta Inteligente (Release 1)

## 1. Visão Geral

A tela implementada corresponde ao Dashboard principal da Horta Inteligente.

Seu objetivo é fornecer uma visão consolidada do estado dos canteiros, sensores ambientais e alertas operacionais, permitindo acompanhamento rápido da situação da horta e apoio à tomada de decisão.

A página apresenta indicadores agregados, informações individuais dos canteiros e eventos recentes gerados pelo sistema.

---

# 2. Justificativa da Escolha da Tela

A equipe optou por implementar o Dashboard como primeira entrega funcional por ser a página com maior concentração de riscos técnicos e requisitos de integração do sistema.

Diferentemente de telas de cadastro ou consulta simples, o Dashboard exige:

* Integração de múltiplos componentes visuais;
* Consumo de dados estruturados;
* Tratamento de diferentes estados da aplicação;
* Exibição simultânea de métricas e alertas;
* Atualização dinâmica dos dados;
* Escalabilidade para futura integração com API real.

A implementação desta tela valida antecipadamente os principais desafios arquiteturais do projeto, reduzindo riscos para as próximas entregas.

---

# 3. Wireframe da Versão Implementada

Estrutura lógica da interface:

┌───────────────────────────────────────────────┐
│ Dashboard da Horta                            │
│ Última atualização                            │
├───────────────────────────────────────────────┤
│ Métricas Gerais                               │
│ Temperatura | Umidade | Água | Saúde          │
├───────────────────────────────────────────────┤
│ Lista de Canteiros                            │
│                                               │
│ Canteiro 01                                   │
│ Canteiro 02                                   │
│ Canteiro 03                                   │
├───────────────────────────────────────────────┤
│ Detalhes do Canteiro Selecionado              │
├───────────────────────────────────────────────┤
│ Alertas Recentes                              │
└───────────────────────────────────────────────┘

O wireframe representa fielmente a estrutura atualmente implementada na aplicação.

---

# 4. Estados Visuais Implementados

A tela contempla todos os estados previstos para uma interface resiliente.

## Loading

Objetivo:

Representar o carregamento inicial dos dados.

Comportamento:

* Exibição de Skeleton Screen;
* Layout preservado;
* Evita efeito de tela vazia.

---

## Success

Objetivo:

Representar a operação normal da aplicação.

Comportamento:

* Dashboard completo renderizado;
* Métricas, canteiros e alertas exibidos;
* Atualização manual disponível.

---

## Empty

Objetivo:

Comunicar ausência de dados.

Comportamento:

* Mensagem amigável;
* Interface continua funcional;
* Nenhum erro visual.

---

## Partial

Objetivo:

Representar indisponibilidade parcial dos sensores.

Comportamento:

* Dados disponíveis continuam sendo exibidos;
* Alertas informam inconsistências;
* Não interrompe a experiência do usuário.

---

## Error

Objetivo:

Comunicar falhas de obtenção dos dados.

Comportamento:

* Mensagem de erro clara;
* Possibilidade de nova tentativa;
* Evita tela quebrada.

---

# 5. Arquitetura da Solução

A aplicação foi estruturada para desacoplar a interface da origem dos dados.

Fluxo atual:

UI
↓
useDashboard()
↓
getDashboardData()
↓
Mock API
↓
Adapters
↓
Dados normalizados

Essa arquitetura permite substituir a origem mockada por uma API real sem necessidade de alterar os componentes visuais.

A mudança ficará concentrada na camada de acesso aos dados.

---

# 6. Organização dos Dados Mockados

Os cenários foram separados por responsabilidade.

src/mocks/

* success.ts
* empty.ts
* partial.ts
* error.ts

Cada mock representa um comportamento real esperado da aplicação.

Os dados simulam:

* Temperaturas plausíveis;
* Umidade realista;
* Leituras de sensores;
* Alertas operacionais;
* Timestamps coerentes.

Essa abordagem permite validar comportamento sem dependência de backend.

---

# 7. Tecnologias Utilizadas

## Next.js

Utilizado como framework principal da aplicação.

Motivos:

* Estrutura escalável;
* Organização por páginas;
* Facilidade de manutenção.

---

## React

Utilizado para construção dos componentes.

Motivos:

* Reutilização;
* Componentização;
* Separação de responsabilidades.

---

## TypeScript

Utilizado para tipagem da aplicação.

Motivos:

* Redução de erros;
* Maior previsibilidade;
* Melhor manutenção.

---

## Recharts

Utilizado para visualização gráfica dos dados.

Motivos:

* Integração simples com React;
* Boa legibilidade dos indicadores.

---

## Jest + React Testing Library

Utilizados para validação automática dos comportamentos críticos da interface.

Motivos:

* Testes reproduzíveis;
* Maior confiabilidade;
* Cobertura dos riscos identificados.

---

# 8. Estratégia de Evolução

A implementação atual utiliza dados simulados para permitir validação completa da experiência do usuário.

A evolução para ambiente produtivo ocorrerá por meio da substituição da camada de acesso localizada em:

src/lib/api/dashboard.ts

Sem necessidade de alteração dos componentes de interface.

Essa decisão reduz impacto futuro e facilita integração contínua.

---

# 9. Resultado

A entrega valida integralmente o fluxo E2E do Dashboard, contemplando:

* Interface funcional;
* Dados realistas;
* Tratamento de estados;
* Arquitetura desacoplada;
* Base preparada para integração com backend real.

A solução atende aos objetivos da Release 1 e reduz significativamente os riscos técnicos das próximas etapas do projeto.
