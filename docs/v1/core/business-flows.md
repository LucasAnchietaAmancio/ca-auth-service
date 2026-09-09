# Fluxos de negócio

## Fluxo implementado: cadastro de empresa

1. Cliente envia `POST /v1/companies`.
2. Controller valida os campos obrigatórios.
3. `CreateCompanyUseCase` valida o e-mail e verifica duplicidade.
4. Senha e segredo TOTP são cifrados antes de `PostgresCompanyRepository` persistir a empresa.
5. API retorna `201` com o `companyId`.
6. Erros são encaminhados ao middleware global.

## Fluxo parcialmente implementado: geração de sessão

1. Uma chamada fornece `companyId` ao `GenerateSessionUseCase`.
2. O caso de uso busca a empresa.
3. O caso de uso chama a porta de autenticação com as credenciais.
4. O resultado cria uma `SessionEntity` em memória.

O fluxo está disponível por `POST /v1/companies/:companyId/sessions`. O token externo não é exposto na resposta HTTP; ela contém somente o `sessionId`. Ainda faltam persistência, lock e publicação.

## Fluxo planejado: autenticação completa

1. Receber solicitação manual, agendada ou por invalidação da sessão.
2. Adquirir lock `companyId`.
3. Buscar e descriptografar credenciais.
4. Executar login no Conta Azul.
5. Gerar e validar TOTP.
6. Capturar cookies e access token.
7. Persistir a sessão.
8. Publicar `SessionAuthenticated`.
9. Agendar renovação antes da expiração.
10. Liberar o lock em bloco de finalização.

## Falha planejada

Em credencial inválida, TOTP inválido, CAPTCHA, mudança de layout ou indisponibilidade externa, o serviço deverá classificar a falha, registrar somente dados não sensíveis, notificar o responsável e liberar o lock sem retry automático.

## Invariantes de segurança

- Toda operação de autenticação deve estar associada a um `companyId`.
- Senhas, segredos TOTP, cookies e tokens não podem ser registrados em logs, exceções ou alertas.
- O lock deve ser liberado mesmo quando a autenticação falhar.
- Credenciais persistidas devem ser criptografadas antes da liberação para produção.
