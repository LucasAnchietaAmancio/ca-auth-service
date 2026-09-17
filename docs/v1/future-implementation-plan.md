# Plano de produção do MVP

Este plano descreve o que falta para operar a API com segurança. Itens de eventos, scheduler e persistência histórica podem ficar para depois do MVP, desde que a sessão em Redis seja suficiente para o consumidor atual.

## Obrigatório antes de expor a API

1. **Validar ambiente real.** Subir PostgreSQL e Redis, aplicar migrations e executar o login contra uma conta de homologação. Confirmar seletores, cookies e expiração em milissegundos.
2. **Autenticar e autorizar chamadas.** A rota de sessão não pode ficar pública; definir identidade do cliente e escopo por empresa.
3. **Rate limit e lock distribuído.** Limitar tentativas e usar chave de lock por `companyId` para impedir sessões concorrentes.
4. **Segurança de segredos.** Mover `SECRET_KEY` para um gerenciador de segredos, permitir rotação e substituir a cifra atual por criptografia autenticada.
5. **Observabilidade segura.** Logs estruturados, correlação, métricas e alertas sem token, cookie, senha, segredo TOTP ou corpo sensível.
6. **Operação.** Health/readiness checks, timeout, encerramento gracioso de Express/Prisma/Redis, TLS, autenticação Redis, backup PostgreSQL e estratégia de migrations no deploy.
7. **Qualidade e dependências.** Testes de integração Redis/PostgreSQL e fluxo Puppeteer controlado; avaliar e mitigar vulnerabilidades altas apontadas pelo `npm audit`.

## Próxima fase

- Persistir histórico/auditoria de sessões em PostgreSQL.
- Definir invalidação explícita de sessão.
- Publicar `SessionAuthenticated` somente após persistência definida.
- Scheduler de renovação, notificação de falhas e política de retries.
- Detecção explícita de CAPTCHA e monitoramento/versionamento dos seletores externos.
