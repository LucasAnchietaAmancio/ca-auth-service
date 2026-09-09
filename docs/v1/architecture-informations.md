# Arquitetura e requisitos

## Visão geral

O `auth-service` é um serviço em TypeScript para cadastrar empresas e, na versão planejada, autenticar cada empresa no ERP Conta Azul. A autenticação será automatizada por navegador headless porque o fluxo externo exige MFA/TOTP.

## Estado da versão atual

A implementação disponível nesta branch entrega a base multiempresa:

- aplicação organizada em arquitetura hexagonal;
- cadastro HTTP de empresas;
- validação de e-mail e senha no domínio;
- persistência PostgreSQL via Prisma;
- busca de empresa por `companyId`;
- proteção reversível de senha e segredo TOTP em repouso;
- geração de TOTP;
- login externo via adapter Puppeteer e criação de uma `SessionEntity` em memória.

O adapter Conta Azul implementa seu método `execute`, mas seus seletores e o fluxo real ainda devem ser validados com uma conta de homologação. Não há sessão persistida nem publicação de eventos.

## Escopo planejado

- autenticar uma empresa no Conta Azul;
- capturar cookies e access token;
- persistir a sessão por empresa;
- publicar a sessão para consumidores, como `inventory-service`;
- renovar a sessão antes da expiração;
- impedir autenticações concorrentes por empresa;
- notificar falhas sem retry automático.

## Requisitos e status

| ID | Requisito | Status |
|---|---|---|
| RF001 | Autenticar com usuário e senha | Implementado; requer validação integrada |
| RF002 | Gerar TOTP | Implementado |
| RF003 | Validar segundo fator | Implementado; requer validação integrada |
| RF004 | Capturar access token | Implementado; requer validação integrada |
| RF005 | Publicar evento de autenticação | Não implementado |
| RF006 | Renovar sessão antes da expiração | Não implementado |
| RF007 | Lock distribuído por empresa | Não implementado |
| RF008 | Notificar falhas sem retry automático | Não implementado |
| RF009 | Persistir credenciais por empresa | Implementado com criptografia reversível; gestão de chaves ainda precisa ser endurecida |

## Persistência atual

A tabela `Company` possui `companyId`, `companyName`, `email`, `password` e `totpSecret`. Senha e segredo TOTP são cifrados antes da persistência. A chave permanece fora do banco, mas rotação e gestão segura de chaves ainda são pendências para produção.

Ainda não existem tabelas de sessão, lock ou histórico de autenticação.

## Evento planejado

O evento `SessionAuthenticated` ainda não é publicado. Quando implementado, deverá incluir pelo menos:

```json
{
  "companyId": "uuid",
  "sessionId": "uuid",
  "cookieHeader": "string",
  "accessToken": "string",
  "authenticatedAt": "2026-08-06T10:00:00.000Z",
  "expiresAt": "2026-08-12T10:00:00.000Z"
}
```

Cookies, tokens, senhas e segredos TOTP não devem aparecer em logs ou alertas.

## Tecnologias presentes e planejadas

| Categoria | Estado |
|---|---|
| Node.js e TypeScript | Presente |
| Express | Presente |
| PostgreSQL e Prisma | Presente |
| Jest | Presente |
| Puppeteer e TOTP | Presentes; fluxo externo requer validação integrada |
| RabbitMQ, Redis e SMTP | Planejados |
