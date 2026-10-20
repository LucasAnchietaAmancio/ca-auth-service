# auth-service

Serviço multiempresa que armazena credenciais do Conta Azul, autentica por navegador com TOTP e mantém a sessão externa em Redis. O projeto usa arquitetura hexagonal: domínio e casos de uso não dependem de Express, Prisma, Redis ou Puppeteer.

## Estado atual

- Cadastro de empresas, validação de dados e cifragem de senha/segredo TOTP: implementados.
- PostgreSQL/Prisma: implementados.
- Login Conta Azul via Puppeteer e TOTP: implementado, mas ainda requer validação com conta de homologação.
- Cache de sessão no Redis: implementado. A sessão é reutilizada até `expiresAt` e não é enviada na resposta HTTP.
- Autenticação da API, rate limit, lock distribuído, eventos, scheduler e notificações: pendentes.

`expiresAt` deve ser um timestamp Unix em **milissegundos** (por exemplo, `1789673046000`).

## Pré-requisitos

- Node.js 20 ou superior;
- Docker e Docker Compose;
- chave longa e secreta para `SECRET_KEY`;
- conta de homologação autorizada para validar a integração externa.

## Configuração e execução local

Copie `.env.example` para `.env` e substitua valores de exemplo. `REDIS_URL` é obrigatório.

```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/auth_service"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="senha"
POSTGRES_DB="auth_service"
REDIS_URL="redis://localhost:6379"
PORT="3000"
SECRET_KEY="uma-chave-longa-e-aleatoria"
```

Suba PostgreSQL e Redis, gere o Prisma, aplique migrations e inicie a API:

```bash
npm install
docker compose up -d
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

O processo só abre a porta HTTP depois de conectar ao Redis. Falha de conexão encerra o bootstrap com `CACHE_CONNECTION_FAILED`.

## API atual

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
  "payload": { "companyId": "uuid" }
}
```

### Solicitar ou reutilizar sessão

`POST /v1/companies/:companyId/sessions`

O serviço procura `session:company:{companyId}` no Redis. Se houver uma sessão não expirada, ela é reutilizada. Caso contrário, descriptografa as credenciais em memória, executa o login externo e grava a sessão no Redis com TTL até `expiresAt`.

Resposta `201`:

```json
{
  "success": true,
  "payload": { "sessionId": "uuid" }
}
```

O access token, senha, segredo TOTP e cookies nunca são retornados pela API.

### Erros relevantes

As falhas usam `success: false` e `error.code`:

- `400`: entrada, e-mail, senha ou TOTP inválidos;
- `404`: `NOT_FOUND`;
- `409`: `USER_ALREADY_EXISTS` ou `DUPLICATE_EMAIL`;
- `502`: falhas de autenticação externa;
- `503`: falha de banco ou cache (`CACHE_READ_FAILED`, `CACHE_WRITE_FAILED`, `INVALID_CACHED_SESSION`);
- `500`: falha inesperada.

## Verificação

```bash
npm test -- --runInBand
npx tsc --noEmit
npm audit --omit=dev
```

Os testes atuais cobrem domínio, casos de uso, controllers, middleware e configuração. A integração Redis/PostgreSQL/Puppeteer ainda não é exercitada de ponta a ponta.

## Produção do MVP

O checklist de produção está em [Plano de produção do MVP](docs/v1/future-implementation-plan.md). Os itens mínimos são autenticar quem chama a API, limitar requisições, impedir logins concorrentes, validar a Conta Azul em homologação, adicionar health checks/encerramento gracioso, logs seguros, testes de integração e tratar dependências vulneráveis.

## Documentação

- [Arquitetura](docs/v1/architecture-informations.md)
- [Domínio](docs/v1/core/domain.md)
- [Casos de uso](docs/v1/core/use-cases.md)
- [Fluxos de negócio](docs/v1/core/business-flows.md)
- [Checklist de implementação](docs/v1/implementing.md)
- [Adapter Puppeteer](docs/v1/conta-azul-puppeteer-adapter.md)
- [Plano de produção do MVP](docs/v1/future-implementation-plan.md)
