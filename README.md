# Projeto Exemplo de Testes

Aplicação CRUD (Sistema Hospitalar) desenvolvida com Node.js, Express, Sequelize, SQLite e Handlebars.

## Instalação

```bash
npm install
```

## Executar a aplicação

```bash
npm start
```

Acesse http://localhost:3000

## Testes

Os testes foram feitos com o **Vitest**, usando o **Supertest** para simular requisições HTTP.

### Comandos

| Comando | O que faz |
|---|---|
| `npm test` | Executa todos os testes uma vez |
| `npm run test:watch` | Executa os testes e reexecuta ao salvar arquivos |
| `npm run coverage` | Executa os testes e gera o relatório de cobertura (pasta `coverage/`) |

### Como funcionam

- Os testes ficam na pasta `tests/`.
- Eles usam um banco SQLite **em memória** (`DB_STORAGE=':memory:'`), então não alteram o arquivo `bd.sqlite`.
- O servidor não é iniciado: o `app.js` apenas exporta o app, e o `server.js` é quem chama o `listen()`.
- Antes de cada teste, as tabelas são limpas para que um teste não dependa de outro.

### O que é testado

| Área | Testes |
|---|---|
| Página inicial | Acesso a `/` e exibição do título "Sistema Hospitalar" |
| Médicos | Cadastro, listagem e formulário de cadastro |
| Especialidades | Cadastro e listagem |
| Pacientes | Cadastro com prontuário e listagem |
| Consultas | Cadastro, listagem com paciente e médico, e formulário de cadastro |

Cada teste de cadastro verifica o redirecionamento (status `302`) e confere no banco se o registro foi realmente salvo. Cada teste de listagem verifica o status `200` e se os dados aparecem na página.

### Relatório de cobertura

Depois de rodar `npm run coverage`, abra `coverage/index.html` no navegador para ver quais linhas foram executadas pelos testes.