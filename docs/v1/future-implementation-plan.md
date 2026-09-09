# Plano futuro de implementação

Este documento preserva o plano funcional da v1 separado da descrição do código já entregue. Os itens abaixo são objetivos futuros e não representam funcionalidades disponíveis atualmente.

## 1. Evolução da proteção de credenciais

- Substituir a cifra atual por mecanismo autenticado com gestão de chaves e rotação.
- Versionar a chave usada por cada credencial para permitir rotação segura.
- Impedir que senhas, segredos TOTP, cookies e access tokens apareçam em logs, erros ou alertas.
- Criar testes para criptografia, descriptografia e falha de chave.

## 2. Autenticação no Conta Azul

- Validar `ContaAzulPuppeteerAuthAdapter.execute` com uma conta de homologação.
- Versionar e monitorar seletores e etapas da interface externa.
- Confirmar a origem, duração e estratégia segura de persistência do token.
- Detectar credenciais inválidas, TOTP inválido, CAPTCHA, indisponibilidade e mudanças de layout.
- Classificar falhas externas sem expor dados sensíveis.
- Criar testes unitários dos contratos e testes de integração controlados do adapter.

## 3. Sessões

- Incluir `companyId` e `authenticatedAt` na sessão.
- Criar modelo Prisma para sessões autenticadas.
- Criar `SessionRepositoryPort` e implementação PostgreSQL.
- Persistir a sessão após uma autenticação bem-sucedida.
- Definir estratégia para substituir ou invalidar sessões anteriores.
- Consultar expiração para decidir quando renovar a autenticação.

## 4. Lock distribuído

- Criar `DistributedLockPort`.
- Implementar o lock com Redis.
- Usar uma chave isolada por empresa, por exemplo `auth:login-lock:{companyId}`.
- Encerrar a execução quando outra autenticação já estiver em andamento.
- Garantir a liberação do lock em sucesso, falha e exceção inesperada.
- Testar concorrência e expiração do lock.

## 5. Publicação de eventos

- Criar `EventPublisherPort`.
- Implementar publicação usando RabbitMQ.
- Publicar `SessionAuthenticated` somente depois da persistência da sessão.
- Incluir `companyId`, `sessionId`, `cookieHeader`, `accessToken`, `authenticatedAt` e `expiresAt`.
- Documentar a versão do payload e a estratégia de compatibilidade.
- Validar o schema no consumidor, já que os serviços estão em repositórios separados.

## 6. Entrada e orquestração

- Criar uma entrada HTTP ou mensagem para solicitar autenticação por `companyId`.
- Integrar no factory o repositório, o adapter Conta Azul, o lock, a persistência e o publisher.
- Fazer o `GenerateSessionUseCase` orquestrar o fluxo completo.
- Garantir que cada execução seja isolada por empresa.
- Cobrir sucesso, empresa inexistente, lock ocupado e falhas do provedor.

## 7. Renovação automática

- Adicionar scheduler com `node-cron` ou mecanismo equivalente.
- Localizar sessões próximas da expiração.
- Iniciar o mesmo fluxo completo de autenticação, respeitando o lock.
- Renovar a sessão um dia antes da expiração, conforme a política definida.
- Evitar autenticações duplicadas quando houver execução manual e agendada simultaneamente.

## 8. Notificações e observabilidade

- Criar `FailureNotifierPort`.
- Implementar notificações por SMTP.
- Notificar falhas sem retry automático.
- Adicionar logs estruturados com identificadores não sensíveis, como `companyId` e `sessionId`.
- Adicionar métricas e rastreabilidade do fluxo.
- Nunca registrar credenciais, cookies, tokens ou códigos TOTP.

## 9. Critérios de conclusão da v1

A v1 será considerada implementada quando:

- uma empresa puder ser cadastrada com credenciais protegidas;
- uma solicitação por `companyId` puder executar o login real no Conta Azul;
- TOTP e captura da sessão funcionarem;
- a sessão for persistida e associada à empresa;
- o evento `SessionAuthenticated` for publicado;
- o lock impedir autentizações concorrentes;
- a renovação automática funcionar;
- falhas forem notificadas sem vazamento de dados sensíveis;
- testes cobrirem os fluxos de sucesso, falha e concorrência;
- a aplicação passar em testes, typecheck e execução com Docker Compose.

## Ordem recomendada

1. Corrigir e testar o adapter Conta Azul.
2. Proteger as credenciais.
3. Modelar e persistir sessões.
4. Completar o caso de uso e sua entrada.
5. Adicionar lock e tratamento de falhas.
6. Publicar eventos.
7. Implementar scheduler e renovação.
8. Adicionar notificações, métricas e testes de integração.
