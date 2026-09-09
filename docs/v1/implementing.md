# Checklist de implementação

O plano detalhado dos próximos incrementos está em [Plano futuro de implementação](future-implementation-plan.md).

## Entregue nesta versão

- [x] `EmailValueObject` e `PasswordValueObject`.
- [x] `CompanyEntity` e `SessionEntity`.
- [x] `CreateCompanyUseCase`.
- [x] `GenerateSessionUseCase` como orquestração inicial.
- [x] Cifragem reversível de senha e segredo TOTP em repouso.
- [x] `OtplibTotpAdapter.execute`.
- [x] `ContaAzulPuppeteerAuthAdapter.execute`.
- [x] `CompanyRepositoryPort`.
- [x] `PostgresCompanyRepository`.
- [x] Migração Prisma da tabela `Company`.
- [x] `POST /v1/companies` e `POST /v1/companies/:companyId/sessions`.
- [x] Testes de domínio, casos de uso e controller.

## Em andamento

- [ ] Adicionar um lock de sessão.
- [ ] Validar o adapter Conta Azul contra ambiente de homologação.

## Ainda não implementado

- [ ] Gestão e rotação de chaves para as credenciais cifradas.
- [ ] Persistência segura do token externo e definição de expiração.
- [ ] Entidade e repositório de sessão persistida.
- [ ] Lock distribuído por `companyId`.
- [ ] Publicação do evento `SessionAuthenticated`.
- [ ] Renovação automática e scheduler.
- [ ] Notificação de falhas sem retry automático.
- [ ] Logs estruturados e observabilidade.
- [ ] Contrato runtime do evento com o consumidor.
- [ ] CORS e security headers.

## Critério para considerar o fluxo completo

O fluxo só deve ser marcado como concluído quando uma empresa puder solicitar autenticação, obter uma sessão real do Conta Azul, persistir essa sessão, publicar o evento e liberar o lock tanto no sucesso quanto na falha.
