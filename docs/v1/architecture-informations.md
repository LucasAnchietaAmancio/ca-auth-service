# Arquitetura e requisitos

## Visão geral

O `auth-service` é uma API TypeScript em arquitetura hexagonal. Ela cadastra empresas, protege as credenciais necessárias para login externo e solicita uma sessão do Conta Azul.

```text
HTTP / Express
  -> Controllers
  -> Use cases
  -> Ports
  -> Adapters: PostgreSQL, Redis, Crypto, TOTP e Puppeteer
```

## Fluxo de infraestrutura atual

No bootstrap, `RedisClientFactory` cria e conecta um `RedisClientType`. Esse cliente é injetado por `App`, `CompanyRoute` e `GenerateSessionControllerFactory` até `RedisSessionCacheAdapter`. O adapter não cria conexão: sua responsabilidade é somente ler e salvar sessões.

O processo não começa a escutar HTTP se Redis não conectar. PostgreSQL é acessado pelo adapter Prisma durante as requisições.

## Requisitos e estado

| ID | Requisito | Estado |
|---|---|---|
| RF001 | Cadastrar empresa | Implementado |
| RF002 | Proteger credenciais em repouso | Implementado; endurecimento criptográfico pendente |
| RF003 | Gerar TOTP | Implementado |
| RF004 | Autenticar e capturar sessão externa | Implementado; validação real pendente |
| RF005 | Reutilizar sessão não expirada | Implementado via Redis |
| RF006 | Persistir histórico de sessão | Não implementado |
| RF007 | Impedir autenticações concorrentes | Não implementado |
| RF008 | Publicar evento/notificar falhas | Não implementado |
| RF009 | Proteger a API chamadora | Não implementado |

## Sessões

Uma sessão possui `sessionId`, `accessToken` e `expiresAt`. A expiração é Unix em milissegundos. O Redis armazena a chave `session:company:{companyId}` até sua expiração. Essa é uma estratégia de cache, não um histórico durável de auditoria.

## Segurança

Tokens, cookies, senha e segredo TOTP não devem aparecer em respostas, logs, mensagens de erro ou métricas. Credenciais ficam cifradas no PostgreSQL, mas produção requer gestão de chaves e criptografia autenticada.
