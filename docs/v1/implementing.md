# Checklist de implementação

## Entregue

- [x] Cadastro HTTP de empresas em `POST /v1/companies`.
- [x] Validação de e-mail, senha e segredo TOTP.
- [x] Cifragem de senha e segredo TOTP antes da persistência.
- [x] Repositório PostgreSQL/Prisma de empresas.
- [x] Login Conta Azul por Puppeteer e geração TOTP.
- [x] `SessionEntity` com `sessionId`, access token e `expiresAt` em milissegundos.
- [x] `POST /v1/companies/:companyId/sessions`.
- [x] Cache Redis de sessão por empresa com TTL.
- [x] Criação e conexão do cliente Redis no bootstrap; adapter recebe o cliente pronto por injeção.
- [x] Erros de cache padronizados: `CACHE_CONNECTION_FAILED`, `CACHE_READ_FAILED`, `CACHE_WRITE_FAILED` e `INVALID_CACHED_SESSION`.
- [x] Rate limit Redis por IP na rota de sessão e por empresa antes do login Puppeteer.
- [x] Autenticação Bearer para todas as rotas `/v1` com token configurado em `API_ACCESS_TOKEN`.
- [x] Testes unitários e typecheck.
- [x] Autenticação, autorização e rate limit da API.

## Fora do escopo imediato

- [ ] Testes de integração Redis/PostgreSQL.
- [ ] Teste controlado do login real com Conta Azul.
- [ ] Adicionar nova rota de sessão e tirar a logica da roda de company.
- [ ] Ao invés de ter dois adapters de Cache centralizalos em 1 só que atende os 2 objetivos, de sessão e rate limit.
- [ ] Adicionar metricas e observabilidade.

## Necessário antes de produção

- [ ] Lock distribuído por `companyId`.
- [ ] Health/readiness check e encerramento gracioso de Express, Prisma e Redis.
- [ ] Logs estruturados, métricas e rastreabilidade sem dados sensíveis.
- [ ] Gestão/rotação de chaves e criptografia autenticada para credenciais em repouso.
- [ ] TLS, autenticação e política de persistência/backup para PostgreSQL e Redis.
- [ ] Atualização ou mitigação das dependências vulneráveis reportadas por `npm audit`.
- [ ] Estratégia de tratamento de CAPTCHA e mudanças de layout da Conta Azul.

O plano priorizado está em [Plano de produção do MVP](future-implementation-plan.md).
