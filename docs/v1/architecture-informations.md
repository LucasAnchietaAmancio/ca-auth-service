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

### ***7. Arvore de Arquivos***
```bash
├── .github/
│   └── workflows/
├── docs/
│   ├── architecture-informations.md
│   ├── diagrams/
│   └── core/
├── src/
│   ├── application/
│   │   │   ├── ports/
│   │   │   │   ├── in/
│   │   │   │   └── out/
│   │   │   └── use-cases/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   └── errors/
│   │   └── adapters/
│   │       ├── db/    
│   │       ├── scraper/      # Puppeteer (login)
│   │       ├── totp/         # otplib
│   │       ├── events/       # publisher RabbitMQ
│   │       ├── lock/         # Redis
│   │       ├── notifier/     # e-mail de alerta
│   │       └── schedule/     # node-cron
├── tests/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```
