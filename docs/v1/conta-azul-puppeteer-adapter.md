# Adapter de login Conta Azul

O adapter `ContaAzulPuppeteerAuthAdapter` implementa a porta de autenticação externa. Ele recebe e-mail, senha e segredo TOTP já descriptografados pelo caso de uso; não registra esses valores.

## Fluxo

1. Abre `https://login.contaazul.com`.
2. Envia e-mail e senha.
3. Gera um código TOTP por `OtplibTotpAdapter` e o envia quando solicitado.
4. Captura cookies, access token e expiração para criar a sessão em memória.

CAPTCHA não é contornado: o adapter encerra o fluxo com `CAPTCHA_REQUIRED`. Alterações de página, credenciais recusadas e falhas de captura são classificadas sem incluir dados sensíveis na mensagem.

## Configuração

Além de `SECRET_KEY`, configure quando os seletores ou a chave de armazenamento do provedor forem diferentes:

```env
SECRET_KEY="chave-longa-e-secreta-fora-do-repositorio"
CONTA_AZUL_LOGIN_URL="https://login.contaazul.com"
CONTA_AZUL_HEADLESS="true"
CONTA_AZUL_LOGIN_TIMEOUT_MS="30000"
CONTA_AZUL_AUTHENTICATED_URL_PATTERN="app.contaazul.com"
CONTA_AZUL_EMAIL_SELECTOR='input[type="email"]'
CONTA_AZUL_PASSWORD_SELECTOR='input[type="password"]'
CONTA_AZUL_SUBMIT_SELECTOR='button[type="submit"]'
CONTA_AZUL_TOTP_SELECTOR='input[autocomplete="one-time-code"]'
CONTA_AZUL_ACCESS_TOKEN_STORAGE_KEY="access_token"
```

O processo pode ser solicitado por `POST /v1/companies/:companyId/sessions`. Esta etapa ainda não persiste nem publica a sessão; o retorno HTTP expõe somente `sessionId`.
