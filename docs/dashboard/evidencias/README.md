# Evidências de Execução — Dashboard E2E (A1.7)

## Objetivo

Esta pasta contém todas as evidências necessárias para comprovar a execução da entrega A1.7, permitindo auditoria da implementação, validação dos testes e rastreabilidade com os requisitos definidos pela equipe.

---

# Estrutura Recomendada

```text
evidencias/
│
├── README.md
├── npm-test-log.txt
├── build-log.txt
├── dashboard-success.png
├── dashboard-loading.png
├── dashboard-empty.png
├── dashboard-partial.png
├── dashboard-error.png
└── dashboard-refresh.png
```

---

# Evidências de Teste

## npm-test-log.txt

Contém a saída completa do comando:

```bash
npm test
```

Objetivo:

* Demonstrar que os testes executaram com sucesso.
* Comprovar cobertura dos cenários definidos na matriz risco → teste.

Relacionamento:

* CT-01 (Error)
* CT-02 (Empty)
* CT-03 (Partial)
* CT-04 (Loading)
* CT-05 (Success)
* CT-06 (Refresh)

---

# Evidências de Build

## build-log.txt

Contém a saída completa do comando:

```bash
npm run build
```

Objetivo:

* Demonstrar que a aplicação compila sem erros.
* Validar que a release pode ser distribuída.

---

# Evidências Visuais

## dashboard-success.png

Cenário:

Success

Objetivo:

Comprovar renderização completa do dashboard.

Relacionamento:

RF-04
RF-05
RF-06

---

## dashboard-loading.png

Cenário:

Loading

Objetivo:

Comprovar exibição do skeleton de carregamento.

Relacionamento:

R4 → CT-04

---

## dashboard-empty.png

Cenário:

Empty

Objetivo:

Comprovar comportamento quando não existem dados disponíveis.

Relacionamento:

R2 → CT-02

---

## dashboard-partial.png

Cenário:

Partial

Objetivo:

Comprovar funcionamento com dados incompletos.

Relacionamento:

R3 → CT-03

---

## dashboard-error.png

Cenário:

Error

Objetivo:

Comprovar tratamento de falhas na obtenção dos dados.

Relacionamento:

R1 → CT-01

---

## dashboard-refresh.png

Cenário:

Refresh

Objetivo:

Comprovar atualização manual dos dados.

Relacionamento:

R6 → CT-06

---

# Procedimento de Reprodução

## Instalação

```bash
npm install --legacy-peer-deps
```

## Execução Local

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Testes

```bash
npm test
```

---

# Rastreabilidade

| Artefato              | Documento Relacionado |
| --------------------- | --------------------- |
| npm-test-log.txt      | risk-test-matrix.md   |
| build-log.txt         | release-1.md          |
| dashboard-success.png | page-visao-geral.md   |
| dashboard-loading.png | risk-test-matrix.md   |
| dashboard-empty.png   | risk-test-matrix.md   |
| dashboard-partial.png | risk-test-matrix.md   |
| dashboard-error.png   | risk-test-matrix.md   |
| dashboard-refresh.png | risk-test-matrix.md   |

---

# Critério de Aceitação

A evidência é considerada válida quando:

* Os testes executam sem falhas;
* O build conclui sem erros;
* Todos os estados visuais obrigatórios possuem captura de tela;
* A rastreabilidade entre requisito, risco, teste e evidência pode ser seguida por um avaliador sem necessidade de explicações adicionais.
