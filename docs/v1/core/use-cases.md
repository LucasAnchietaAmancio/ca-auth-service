# Casos de uso

## CreateCompanyUseCase

Entrada:

```ts
{ companyName: string; email: string; password: string; totpSecret: string }
```

Fluxo: valida os dados de domínio, verifica e-mail duplicado, cifra senha e segredo TOTP, persiste a empresa e retorna `companyId`.

## GenerateSessionUseCase

Entrada:

```ts
{ companyId: string }
```

Fluxo:

1. Busca a empresa pelo `companyId`.
2. Consulta o `SessionCacheAdapterPort`.
3. Retorna a sessão cacheada se ela ainda não expirou.
4. Descriptografa senha e segredo TOTP somente em memória.
5. Executa a porta de autenticação Conta Azul.
6. Cria `SessionEntity` com o token e `expiresAt` em milissegundos.
7. Salva a sessão no cache até a expiração e a retorna.

O caso de uso ainda não usa lock distribuído, persistência histórica, eventos ou renovação agendada.
