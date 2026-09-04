### ***1. Visão Geral do Sistema***
*O sistema consiste no serviço de autenticação de um ecossistema de microsserviços distribuídos em formato, projetado para automatizar a o processo de login e captura de credenciais do ERP Conta azul.

---

### ***2. Objetivo do Sistema***
*Automatizar a obtenção de sessões autenticadas do ERP Conta Azul de forma resiliente, escalável e totalmente automatizada, permitindo que os dados estejam sempre atualizados sem ou com intervenção humana.*

---

### ***3. Escopo***
*Responsável pela autenticação junto ao ERP Conta Azul e envio de sessão para o inventory-service*

---

### ***4. Requisitos Funcionais***

*RF001 - Realizar autenticação utilizando usuário e senha.*

*RF002 - Gerar o código TOTP.*

*RF003 - Validar o segundo fator.*

*RF004 - Capturar cookies da sessão.*

*RF005 - Publicar um evento contendo os dados necessários para autenticação dos demais serviços.*

*RF006 - Renovar automaticamente a sessão 1 dia antes da expiração*

*RF007 - Adquirir e liberar um lock distribuído durante a execução do login, impedindo autenticações concorrentes.*

*RF008 - Enviar notificações de falha de autenticação, sem retry automático.*

*RF009 - Persistir credenciais da empresa*


---

### **5. Catalogo de eventos**

### ***Evento 1*** - Autenticação
### **Publicador:**
    auth-service
### **Consumidor:**
    inventory-service
### **Payload:**
```json
{
  "sessionId": "uuid",
  "cookieHeader": "string",
  "accessToken": "string",
  "authenticatedAt": "2026-08-06T10:00:00.000Z",
  "expiresAt": "2026-08-12T10:00:00.000Z"
}
```
*Obs: o inventory-service valida este schema em runtime, já que não há pacote de contrato compartilhado.*

---

### ***6. Tecnologias***

| Categoria | Tecnologia |
|---|---|
| Linguagem | Node.js, TypeScript |
| Mensageria | RabbitMQ, amqplib |
| Agendamento | node-cron |
| Automação de navegador | Puppeteer |
| Autenticação (2FA) | otplib (TOTP) |
| Validação de schema | Zod |
| Lock distribuído | Redis |
| Notificação de falhas | Nodemailer (SMTP) |
| Observabilidade | Pino (logs estruturados) + Grafana Loki |
| Testes | Jest |
| Containerização | Docker, Docker Compose |

---

### ***Melhoria futura - proteção de credenciais***

As credenciais de empresas devem ser persistidas com criptografia reversível em repouso, pois são necessárias no login externo do Conta Azul. A implementação deverá ser introduzida por uma porta de saída, para que a aplicação dependa apenas de um contrato de criptografia e a infraestrutura concentre o acesso à chave e ao mecanismo criptográfico. Senhas, cookies e access tokens não devem ser registrados em logs, erros ou eventos.

---

### ***7. Arvore de Arquivos***
```bash
├── .github/
│   └── workflows/
├── docs
│   └── v1
│       ├── core
│       │   ├── business-flows.md
│       │   ├── domain.md
│       │   └── use-cases.md
│       ├── diagrams
│       │   ├── architecture
│       │   │   └── Explicit Hexagonal Architecture.png
│       │   ├── auth-service-simple-flow.png
│       │   └── database-diagram.png
│       ├── architecture-informations.md
│       └── implementing.md
├── prisma
│   ├── migrations
│   │   ├── 20260904152252_initial_migration
│   │   │   └── migration.sql
│   │   └── migration_lock.toml
│   └── schema.prisma
├── src
│   ├── application
│   │   ├── dto
│   │   │   ├── CreateCompanyDto.ts
│   │   │   ├── GenerateSessionDto.ts
│   │   │   └── PuppeteerAuthAdapterResponseDto.ts
│   │   ├── ports
│   │   │   └── in
│   │   │       ├── CreateCompanyUseCasePort.ts
│   │   │       └── GenerateSessionUseCasePort.ts
│   │   └── use-cases
│   │       ├── CreateCompanyUseCase.ts
│   │       └── GenerateSessionUseCase.ts
│   ├── domain
│   │   ├── entities
│   │   │   ├── CompanyEntity.ts
│   │   │   └── SessionEntity.ts
│   │   ├── exceptions
│   │   │   ├── CompanyNotFoundError.ts
│   │   │   ├── DatabaseException.ts
│   │   │   ├── InvalidEmailException.ts
│   │   │   ├── InvalidInputParams.ts
│   │   │   ├── InvalidPasswordException.ts
│   │   │   └── UserAlreadyExists.ts
│   │   └── value-objects
│   │       ├── EmailValueObject.ts
│   │       └── PasswordValueObject.ts
│   ├── infra
│   │   └── in
│   │   |    └── web
│   │   |        ├── controllers
│   │   |        │   └── CreateCompanyController.ts
│   │   |        ├── middlewares
│   │   |        │   └── GlobalErrorMiddleware.ts
│   │   |        └── routes
│   │   |           └── CompanyRoute.ts
│   │   └── out
│   │       └── adapters
│   │           ├── database
│   │               └── repositories
|   |                   └── PostgresCompanyRepository.ts
│   └── main
│       ├── app
│       │   └── App.ts
│       ├── factories
│       │   └── CreateCompanyControllerFactory.ts
│       └── server.ts
├── test
│   ├── application
│   │   └── use-cases
│   │       ├── CreateCompanyUseCase.test.ts
│   │       └── GenerateSessionUseCase.test.ts
│   ├── domain
│   │   ├── entities
│   │   │   ├── CompanyEntity.test.ts
│   │   │   └── SessionEntity.test.ts
│   │   └── value-objects
│   │       ├── EmailValueObject.test.ts
│   │       └── PasswordValueObject.test.ts
│   └── infra
│       └── in
│           └── web
│               ├── controllers
│               │   └── CreateCompanyController.test.ts
│               └── middlewares
│                   └── GlobalErrorMiddleware.test.ts
├── .gitignore
├── README.md
├── docker-compose.yml
├── jest.config.cjs
├── package-lock.json
├── package.json
├── prisma.config.ts
└── tsconfig.json
```
```
