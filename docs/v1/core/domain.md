# Domínio

## CompanyEntity

Representa uma empresa cadastrada no serviço.

### Criação

`CompanyEntity.create(companyName, email, password, totpSecret)` gera um `companyId` e valida e-mail, senha e segredo TOTP por value objects.

### Restauração

`CompanyEntity.restore(companyId, companyName, email, encryptedPassword, encryptedTotpSecret)` reconstrói a entidade a partir da persistência.

### Estado atual

A entidade expõe `companyId`, `companyName`, `email`, `password` e `totpSecret`. Senha e segredo são cifrados pelo adapter de criptografia antes da persistência e descriptografados somente durante o login externo.

## SessionEntity

Representa o resultado de uma autenticação.

### Criação

`SessionEntity.create(accessToken)` gera um `sessionId` e mantém o token externo somente em memória.

### Estado atual

A resposta HTTP expõe somente `sessionId`; o `accessToken` não é devolvido ao cliente. A entidade ainda não possui `companyId`, `authenticatedAt`, expiração ou persistência própria. Esses campos devem ser definidos antes da publicação de eventos.

## Value objects

- `EmailValueObject`: valida e normaliza o e-mail.
- `PasswordValueObject`: valida a senha conforme as regras atuais do domínio.
- `TotpSecretValueObject`: valida o segredo TOTP Base32.

## Exceções

O domínio e a aplicação já possuem exceções para entrada inválida, e-mail inválido, senha inválida, empresa inexistente, duplicidade e falhas de banco. A classificação de falhas externas do Conta Azul ainda precisa ser criada.
