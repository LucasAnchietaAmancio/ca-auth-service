# Domínio

## CompanyEntity

Representa a empresa cadastrada. Possui `companyId`, nome, e-mail, senha e segredo TOTP. Senha e segredo são validados em texto claro no cadastro, cifrados antes da persistência e descriptografados apenas para autenticação externa.

## SessionEntity

Representa uma sessão externa em memória/cache. Possui:

- `sessionId`, gerado pela aplicação;
- `accessToken`, nunca exposto pela API HTTP;
- `expiresAt`, timestamp Unix em milissegundos;
- `isExpired()`, que compara `expiresAt` com `Date.now()`.

`SessionEntity.restore` reconstrói a entidade a partir do Redis. A sessão atual não tem persistência relacional, histórico, `companyId` próprio ou `authenticatedAt`.

## Exceções

As exceções padronizadas expõem `message`, `tag` e, quando aplicável, `payload`. Para cache, os códigos atuais são `CACHE_CONNECTION_FAILED`, `CACHE_READ_FAILED`, `CACHE_WRITE_FAILED` e `INVALID_CACHED_SESSION`.
