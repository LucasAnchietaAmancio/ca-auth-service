# Fluxos de negócio

## Cadastro de empresa

1. Cliente envia `POST /v1/companies`.
2. Controller valida campos obrigatórios.
3. Caso de uso valida dados e duplicidade.
4. Senha e segredo TOTP são cifrados e gravados no PostgreSQL.
5. A API retorna `201` com `companyId`.

## Solicitação de sessão

1. Cliente envia `POST /v1/companies/:companyId/sessions`.
2. `GenerateSessionUseCase` busca a empresa e consulta `session:company:{companyId}` no Redis.
3. Uma sessão válida é retornada sem novo login externo.
4. Sem cache válido, a aplicação descriptografa credenciais, gera TOTP e autentica no Conta Azul.
5. O token e `expiresAt` retornados pelo provedor criam uma `SessionEntity`.
6. A sessão é gravada no Redis com TTL até `expiresAt`.
7. A API retorna somente `sessionId`.

Falhas de cache são HTTP 503. Falhas externas são classificadas pelo adapter e retornadas pelo middleware; não devem incluir dados sensíveis.

## Limitação conhecida

Chamadas simultâneas para a mesma empresa podem disparar mais de um login externo. Um lock Redis por empresa é necessário antes de produção.
