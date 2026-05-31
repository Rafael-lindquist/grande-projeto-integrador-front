# Release 1 — Dashboard Overview

## Identificação da Release

**Versão:** v1.0.0

**Data:** Maio/2026

**Entrega:** A1.7 — Implementação E2E da Página Dashboard

**Status:** Concluída

---

# Objetivo da Release

Esta release tem como objetivo validar a implementação end-to-end da página principal do Dashboard da Horta Inteligente, incluindo interface, fluxo de dados, estados visuais, testes automatizados e documentação técnica.

A entrega estabelece a base arquitetural para futuras integrações com backend e expansão funcional do sistema.

---

# Funcionalidades Entregues

## Dashboard Principal

Implementação da tela de Visão Geral responsável por consolidar informações dos canteiros monitorados.

Capacidades entregues:

* Visualização dos canteiros cadastrados;
* Exibição de métricas ambientais;
* Exibição de alertas recentes;
* Atualização manual dos dados;
* Visualização detalhada de informações dos sensores.

---

## Tratamento Completo de Estados

A interface contempla os principais cenários operacionais:

### Loading

Exibição de skeleton screen durante carregamento.

### Success

Exibição completa dos dados disponíveis.

### Empty

Tratamento para ausência de dados.

### Partial

Tratamento para dados parcialmente disponíveis.

### Error

Tratamento de falhas de obtenção de dados.

---

## Arquitetura de Dados

Implementada camada de acesso desacoplada da interface.

Estrutura:

UI
↓
Hook
↓
Service
↓
Adapter
↓
Fonte de Dados

Essa arquitetura permite substituição futura dos mocks por API real sem alterações nos componentes visuais.

---

## Mocks Utilizados

Os cenários foram implementados utilizando dados simulados realistas.

Características:

* Temperaturas plausíveis;
* Umidade compatível com ambiente agrícola;
* Histórico de leituras;
* Alertas contextualizados;
* Timestamps consistentes.

Arquivos:

src/mocks/success.ts

src/mocks/empty.ts

src/mocks/partial.ts

src/mocks/error.ts

---

# Testes Executados

Foi executada validação automatizada utilizando Jest e React Testing Library.

Objetivos validados:

* Renderização correta da interface;
* Tratamento dos estados visuais;
* Comportamento esperado em cenários de erro;
* Integridade da experiência do usuário.

Resultado:

PASS

Dashboard renderizado com sucesso em todos os cenários previstos pela matriz de riscos.

---

# Rastreabilidade

| Requisito | Funcionalidade        | Implementação               | Teste              |
| --------- | --------------------- | --------------------------- | ------------------ |
| RF-04     | Dashboard Geral       | Dashboard Overview          | dashboard.test.tsx |
| RF-05     | Histórico de Leituras | Componentes de Visualização | dashboard.test.tsx |
| RF-06     | Alertas               | Alerts Panel                | dashboard.test.tsx |

---

# Itens Não Entregues Nesta Release

Os itens abaixo foram explicitamente removidos do escopo da Release 1:

* Integração com API real;
* Sistema de autenticação;
* Atualização em tempo real;
* Persistência de preferências do usuário;
* Dashboard administrativo;
* Configuração de sensores.

Esses itens permanecem previstos para releases futuras.

---

# Evidências

As evidências da execução encontram-se em:

docs/dashboard/evidencias/

Conteúdo esperado:

* Captura do estado Loading;
* Captura do estado Success;
* Captura do estado Empty;
* Captura do estado Partial;
* Captura do estado Error;
* Log de execução dos testes;
* Evidência de execução local.

---

# Como Executar

## Instalação

```bash
npm install --legacy-peer-deps
```

## Execução

```bash
npm run dev
```

Aplicação disponível em:

http://localhost:3000

## Testes

```bash
npm test
```

---

# Conclusão

A Release 1 valida com sucesso a arquitetura base do Dashboard da Horta Inteligente, demonstrando funcionamento end-to-end, tratamento de estados críticos, desacoplamento entre interface e dados, testes automatizados e preparação para integração futura com backend real.
