# ADR-0001 — Escolha da Stack Front-End do Dashboard

## Status

Aceito

---

## Data

29/05/2026

---

## Contexto

O sistema desenvolvido consiste em uma plataforma de monitoramento para uma horta inteligente.

A primeira entrega do projeto contempla a implementação da tela de Visão Geral do Dashboard, responsável por apresentar:

* Indicadores consolidados dos canteiros;
* Leituras ambientais;
* Histórico de medições;
* Alertas operacionais;
* Estados de carregamento, erro e ausência de dados;
* Evolução futura para integração com API REST.

Os principais riscos identificados durante a análise foram:

### R1 — Crescimento da interface

O dashboard possui diversos componentes independentes que tendem a crescer ao longo do projeto.

### R2 — Integração futura com API

A aplicação atualmente utiliza mocks, porém deverá consumir dados reais futuramente.

### R3 — Consistência dos dados

Leituras de sensores possuem múltiplos campos e exigem validação de estrutura.

### R4 — Evolução da experiência do usuário

A interface deverá suportar estados distintos como:

* Loading
* Sucesso
* Dados vazios
* Dados parciais
* Erros de comunicação

### R5 — Testabilidade

A equipe definiu como objetivo validar componentes através de testes automatizados.

---

## Decisão

Foi adotada a seguinte stack tecnológica:

| Tecnologia            | Papel                    |
| --------------------- | ------------------------ |
| Next.js               | Framework principal      |
| React                 | Construção da interface  |
| TypeScript            | Segurança de tipos       |
| Tailwind CSS          | Estilização              |
| Recharts              | Visualização de métricas |
| Jest                  | Testes automatizados     |
| React Testing Library | Testes de interface      |

---

## Justificativas

### Next.js

Foi escolhido por oferecer uma estrutura organizada para aplicações React de médio e grande porte.

A organização por páginas e componentes reduz o risco de crescimento descontrolado da aplicação (R1).

Também facilita futuras integrações com APIs e funcionalidades de produção sem necessidade de reestruturação da arquitetura.

---

### React

O dashboard possui diversos elementos reutilizáveis:

* Cards de métricas;
* Gráficos;
* Listas de alertas;
* Painéis de canteiros.

A componentização permite reutilização e manutenção simplificada conforme novos requisitos surgirem (R1).

---

### TypeScript

Os dados provenientes dos sensores possuem múltiplos atributos:

* Temperatura;
* Umidade;
* Luminosidade;
* Estado da irrigação;
* Alertas.

O uso de tipagem reduz erros de integração e inconsistências de dados (R3).

Além disso, facilita a substituição futura dos mocks por APIs reais (R2).

---

### Tailwind CSS

A equipe priorizou velocidade de desenvolvimento e consistência visual.

O Tailwind permite:

* Construção rápida da interface;
* Padronização visual;
* Menor quantidade de CSS customizado;
* Facilidade de manutenção.

Isso reduz o esforço de evolução da interface ao longo do projeto (R4).

---

### Recharts

A tela apresenta séries históricas de leituras ambientais.

A biblioteca permite:

* Gráficos responsivos;
* Integração direta com React;
* Configuração simplificada.

Foi escolhida por atender aos requisitos atuais sem adicionar complexidade desnecessária.

---

### Jest + React Testing Library

A estratégia de qualidade definida pela equipe prevê validação automatizada da interface.

Essas ferramentas permitem verificar:

* Renderização correta;
* Exibição dos estados da tela;
* Comportamento dos componentes;
* Regressões futuras.

A decisão está diretamente relacionada ao risco R5.

---

## Consequências

### Positivas

* Arquitetura escalável;
* Componentização consistente;
* Facilidade de manutenção;
* Integração futura simplificada com API real;
* Redução de erros através de tipagem;
* Melhor cobertura de testes.

### Negativas

* Curva de aprendizado maior para novos integrantes;
* Configuração inicial mais complexa;
* Necessidade de manutenção dos testes automatizados.

---

## Alternativas Consideradas

### React sem Next.js

Rejeitada devido à necessidade de estruturar manualmente aspectos já resolvidos pelo Next.js.

### JavaScript sem TypeScript

Rejeitada pelo risco de inconsistências em estruturas de dados provenientes dos sensores.

### CSS tradicional

Rejeitada pelo aumento do custo de manutenção e menor padronização visual.

---

## Revisão Futura

Este ADR deverá ser revisado quando ocorrer uma das situações:

* Integração com API real;
* Necessidade de autenticação;
* Inclusão de atualizações em tempo real;
* Alteração significativa da arquitetura Front-End.
