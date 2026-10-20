# Adapter Puppeteer Conta Azul

`PuppeteerContaAzulAuthAdapter` implementa a porta de autenticação externa. Recebe e-mail, senha e segredo TOTP já descriptografados em memória e não deve registrá-los em logs.

## Fluxo atual

1. Abre a URL configurada do Conta Azul.
2. Preenche e-mail e senha.
3. Gera e envia o código TOTP.
4. Aguarda URL autenticada ou mensagem de erro configurada.
5. Lê os cookies configurados de access token e expiração.
6. Retorna `accessToken` e `expiresAt` para o caso de uso.

`expiresAt` deve ser fornecido pelo cookie em Unix milissegundos, como `1789673046000`.

## Configuração

Todas as variáveis `CONTA_AZUL_*` estão em `.env.example`: URL, modo headless, timeout, seletores, padrão de URL autenticada e nomes dos cookies de token/expiração.

## Limitações

Os seletores e o fluxo ainda precisam de validação em homologação. CAPTCHA não é contornado e o adapter ainda não possui uma detecção específica para classificá-lo como `CAPTCHA_REQUIRED`; alterações de tela podem resultar em `EXTERNAL_AUTHENTICATION_FAILED` ou timeout.
