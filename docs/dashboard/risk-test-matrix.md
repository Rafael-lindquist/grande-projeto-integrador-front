# Matriz de Risco → Teste (A1.6 → A1.7)

## Objetivo

Esta matriz estabelece a rastreabilidade entre os riscos identificados para a tela de Visão Geral do Dashboard e os testes implementados na entrega A1.7.

O objetivo é garantir que os cenários de maior impacto para o usuário final sejam explicitamente validados durante a evolução do sistema.

---

# Matriz de Risco

| ID | Risco                                            | Probabilidade | Impacto | Criticidade | Estratégia de Mitigação                                   | Teste Associado      |
| -- | ------------------------------------------------ | ------------- | ------- | ----------- | --------------------------------------------------------- | -------------------- |
| R1 | API indisponível ou falha de comunicação         | Média         | Alto    | Alta        | Exibir mensagem amigável e permitir nova tentativa        | Estado Error         |
| R2 | Retorno sem dados disponíveis                    | Média         | Médio   | Média       | Exibir estado Empty com orientação ao usuário             | Estado Empty         |
| R3 | Sensores retornando apenas parte das informações | Alta          | Médio   | Alta        | Renderizar informações válidas e destacar inconsistências | Estado Partial       |
| R4 | Latência elevada na obtenção dos dados           | Alta          | Médio   | Alta        | Exibir skeleton e preservar layout durante carregamento   | Estado Loading       |
| R5 | Dados válidos retornados corretamente            | Alta          | Alto    | Crítica     | Renderizar dashboard completo                             | Estado Success       |
| R6 | Atualização manual não refletir nova consulta    | Média         | Alto    | Alta        | Atualizar timestamp e reexecutar carregamento             | Teste de Refresh     |
| R7 | Quebra de componentes após refatorações futuras  | Média         | Alto    | Alta        | Cobertura automatizada dos principais estados             | Testes Automatizados |

---

# Casos de Teste

## CT-01 — Estado Error

### Risco Coberto

R1 — API indisponível

### Cenário

O serviço lança uma exceção durante a obtenção dos dados.

### Resultado Esperado

* Mensagem de erro exibida.
* Interface permanece funcional.
* Usuário consegue tentar novamente.

### Evidência

dashboard.test.tsx

---

## CT-02 — Estado Empty

### Risco Coberto

R2 — Retorno sem dados

### Cenário

A API retorna estrutura válida sem canteiros ou métricas.

### Resultado Esperado

* Dashboard não quebra.
* Mensagem amigável exibida.
* Usuário entende que não há dados disponíveis.

### Evidência

dashboard.test.tsx

---

## CT-03 — Estado Partial

### Risco Coberto

R3 — Dados incompletos

### Cenário

Parte dos sensores retorna dados válidos e outra parte apresenta falha.

### Resultado Esperado

* Informações disponíveis permanecem visíveis.
* Alerta de inconsistência é apresentado.
* A tela continua utilizável.

### Evidência

dashboard.test.tsx

---

## CT-04 — Estado Loading

### Risco Coberto

R4 — Latência

### Cenário

A consulta permanece em processamento.

### Resultado Esperado

* Skeleton visível.
* Estrutura visual preservada.
* Nenhum conteúdo inválido é exibido.

### Evidência

dashboard.test.tsx

---

## CT-05 — Estado Success

### Risco Coberto

R5 — Fluxo principal

### Cenário

Dados válidos retornados com sucesso.

### Resultado Esperado

* Métricas renderizadas.
* Canteiros exibidos.
* Alertas exibidos.
* Histórico disponível.

### Evidência

dashboard.test.tsx

---

## CT-06 — Atualização Manual

### Risco Coberto

R6 — Refresh não funcional

### Cenário

Usuário aciona o botão "Atualizar".

### Resultado Esperado

* Nova consulta executada.
* Indicador de atualização alterado.
* Dashboard permanece consistente.

### Evidência

dashboard.test.tsx

---

# Rastreabilidade

| Requisito | Funcionalidade               | Risco | Teste |
| --------- | ---------------------------- | ----- | ----- |
| RF-04     | Visão Geral do Dashboard     | R5    | CT-05 |
| RF-05     | Histórico de Leituras        | R5    | CT-05 |
| RF-06     | Alertas Operacionais         | R3    | CT-03 |
| RF-07     | Atualização Manual           | R6    | CT-06 |
| RNF-01    | Disponibilidade da Interface | R1    | CT-01 |
| RNF-02    | Feedback de Carregamento     | R4    | CT-04 |

---

# Critério de Aceitação

A entrega é considerada aprovada quando todos os cenários:

* Loading
* Success
* Empty
* Partial
* Error
* Refresh

apresentarem o comportamento esperado sem quebra da interface.

---

## Localização dos Testes

src/**tests**/dashboard.test.tsx

---

## Localização das Evidências

docs/dashboard/evidencias/
