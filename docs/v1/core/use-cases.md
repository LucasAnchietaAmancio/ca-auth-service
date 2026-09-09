# Casos de uso

## CreateCompanyUseCase

### Entrada

```ts
{
  companyName: string;
  email: string;
  password: string;
  totpSecret: string;
}
```

### Fluxo atual

1. Valida o e-mail.
2. Verifica duplicidade pelo repositório.
3. Cria `CompanyEntity`.
4. Cifra senha e segredo TOTP.
5. Persiste a empresa.
5. Retorna `companyId`.

### Saída

`string` com o identificador da empresa criada.

## GenerateSessionUseCase

### Entrada

```ts
{
  companyId: string;
}
```

### Fluxo atual

1. Busca a empresa pelo `companyId`.
2. Lança `CompanyNotFoundError` se ela não existir.
3. Descriptografa senha e segredo TOTP somente em memória.
4. Envia e-mail, senha e TOTP ao `ContaAzulPuppeteerAuthAdapterPort`.
5. Cria e retorna uma `SessionEntity` com a resposta do adapter.

### Limitações atuais

O caso de uso não persiste a sessão, não adquire lock, não publica eventos nem agenda renovação. Ele é exposto por uma entrada HTTP, mas a integração real com o provedor ainda requer validação controlada.

## Próximos casos/portas

- repositório de sessões;
- proteção/desproteção de credenciais;
- lock por empresa;
- publicação de `SessionAuthenticated`;
- notificação de falhas;
- entrada HTTP ou mensagem para solicitar a autenticação;
- scheduler de renovação.
