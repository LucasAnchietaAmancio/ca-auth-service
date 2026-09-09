# auth-service

Serviço de autenticação multiempresa para o ERP Conta Azul. O projeto segue arquitetura hexagonal e separa regras de domínio, casos de uso, portas, adapters e composição da aplicação.

> Estado atual: o cadastro de empresas, a proteção de credenciais e a orquestração inicial de login estão implementados. O login real via navegador ainda precisa ser validado em ambiente de homologação da Conta Azul; sessões não são persistidas nem publicadas para outros serviços.

## Funcionalidades

| Funcionalidade | Estado |
| --- | --- |
| Cadastro de empresa | Implementado |
| Validação de e-mail, senha e segredo TOTP | Implementado |
| Cifragem reversível de senha e segredo TOTP em repouso | Implementado |
| PostgreSQL e Prisma | Implementado |
| Endpoint para solicitar login | Implementado |
| Geração de código TOTP | Implementado |
| Adapter Puppeteer para Conta Azul | Implementado, requer validação real |
| Captura de token externo | Implementado, dependente da tela externa |
| Persistência de sessão | Pendente |
| Lock distribuído, rate limit e autenticação da API | Pendente |
| Eventos, scheduler e notificações | Pendente |

## Arquitetura

```text
src/
  domain/            entidades, value objects e exceções
  application/       casos de uso, DTOs e portas
  infra/in/          HTTP: rotas, controllers e middleware
  infra/out/         PostgreSQL, criptografia, TOTP e Puppeteer
  main/              factories, Express e servidor
prisma/              schema e migrations
test/                testes unitários
docs/v1/             documentação de domínio e implementação
```

O domínio não depende de Express, Prisma ou Puppeteer. O `GenerateSessionUseCase` descriptografa as credenciais apenas antes de chamar a porta do Conta Azul; o adapter externo não registra senha, segredo TOTP, cookies ou token.

## Pré-requisitos

- Node.js 20 ou superior;
- Docker e Docker Compose, para o PostgreSQL local;
- uma chave longa e aleatória para `SECRET_KEY`;
- credenciais de uma conta de homologação autorizada na Conta Azul para validar o adapter externo.

## Configuração

Copie `.env.example` para `.env` e substitua todos os valores de exemplo.

```powershell
Copy-Item .env.example .env
```

Variáveis obrigatórias:

```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/auth_service"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="senha"
POSTGRES_DB="auth_service"
PORT="3000"
SECRET_KEY="uma-chave-longa-aleatoria-e-secreta"
```

As variáveis `CONTA_AZUL_*` permitem ajustar URL, seletores, timeout e chave de armazenamento do token quando a interface externa mudar. Veja [a documentação do adapter](docs/v1/conta-azul-puppeteer-adapter.md).

Nunca versione o `.env`, senha, segredo TOTP, cookie ou token.

## Execução local

```bash
npm install
docker compose up -d db
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

O servidor inicia em `http://localhost:3000` por padrão.

## API

### Criar empresa

`POST /v1/companies`

```json
{
  "companyName": "Empresa exemplo",
  "email": "contato@empresa.com",
  "password": "SenhaForte!123",
  "totpSecret": "JBSWY3DPEBLW64TMM"
}
```

Resposta `201`:

```json
{
  "success": true,
  "payload": {
    "companyId": "uuid"
  }
}
```

O `totpSecret` deve ser o segredo Base32 do autenticador, não o código temporário de seis dígitos. Senha e segredo são cifrados antes de serem persistidos.

### Solicitar uma sessão

`POST /v1/companies/:companyId/sessions`

O serviço busca a empresa, descriptografa credenciais somente em memória, executa o fluxo de login e tenta capturar a sessão.

Resposta `201`:

```json
{
  "success": true,
  "payload": {
    "sessionId": "uuid"
  }
}
```

O token obtido do Conta Azul é mantido somente no fluxo interno e não é retornado pela API. Nesta fase, a sessão resultante ainda não é persistida; portanto o endpoint é uma integração técnica inicial, não uma sessão reutilizável por outros serviços.

Possíveis falhas externas incluem `INVALID_EXTERNAL_CREDENTIALS`, `CAPTCHA_REQUIRED`, `SESSION_CAPTURE_FAILED` e `EXTERNAL_AUTHENTICATION_FAILED`. CAPTCHA não é contornado pelo serviço.

## Banco de dados e migrations

O schema Prisma atual contém a tabela `Company` com `companyId`, `companyName`, `email`, `password` e `totpSecret`.

```bash
npm run prisma:migrate
```

Após qualquer alteração em `prisma/schema.prisma`, crie uma nova migration com nome descritivo. Não altere migrations que já tenham sido compartilhadas ou aplicadas em outros ambientes.

## Testes e verificação

```bash
npm test -- --runInBand
npx tsc --noEmit
npm audit --omit=dev
```

Os testes atuais cobrem domínio, casos de uso, controllers, middleware e criptografia. Ainda faltam testes de integração PostgreSQL e um teste controlado do adapter Puppeteer contra uma conta de homologação.

## Limitações e próximos incrementos

Antes de produção, é necessário:

1. Proteger a rota de sessão com autenticação/autorização de quem chama a API.
2. Adicionar lock distribuído por empresa e rate limit.
3. Persistir e invalidar sessões com segurança.
4. Publicar o evento de sessão somente após persistência.
5. Adicionar scheduler de renovação, notificações e observabilidade.
6. Testar e versionar os seletores do adapter Puppeteer em homologação.
7. Acompanhar e corrigir os alertas de dependência reportados por `npm audit`.

## Documentação

- [Arquitetura e requisitos](docs/v1/architecture-informations.md)
- [Domínio](docs/v1/core/domain.md)
- [Casos de uso](docs/v1/core/use-cases.md)
- [Fluxos de negócio](docs/v1/core/business-flows.md)
- [Checklist de implementação](docs/v1/implementing.md)
- [Plano futuro](docs/v1/future-implementation-plan.md)
- [Adapter Puppeteer Conta Azul](docs/v1/conta-azul-puppeteer-adapter.md)
