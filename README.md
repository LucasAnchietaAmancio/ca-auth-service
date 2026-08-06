## Descrição do Projeto
 
O `auth-service` é responsável pela autenticação junto ao ERP Conta Azul e pela publicação da sessão autenticada para os demais serviços do ecossistema (ex: `inventory-service`), via evento. Como a plataforma exige autenticação multifator (MFA/TOTP) e não expõe API pública para esse fluxo, o login é automatizado via navegador headless.
 
**Objetivo:** obter sessões autenticadas do ERP Conta Azul de forma resiliente, escalável e automatizada, sem depender de intervenção humana no dia a dia.
 
**Escopo:** autenticação junto ao Conta Azul e gerenciamento do ciclo de vida da sessão (captura, renovação e publicação de evento). Não inclui sincronização de dados — isso é responsabilidade do `inventory-service`, em repositório separado.
 
## Status do Projeto
 
> Projeto em construção
 
## Arquitetura
 
Arquitetura Hexagonal (Ports & Adapters): regras de negócio (`domain`) e casos de uso (`application`) isolados de detalhes de infraestrutura (`adapters`).
 
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
 
## Funcionalidades
 
- `Login`: autenticação com usuário e senha via navegador headless (Puppeteer).
- `TOTP`: geração e validação do segundo fator de autenticação.
- `Sessão`: captura os cookies do navegador.
- `Publicação de evento`: emite `SessionAuthenticated` para os demais serviços.
- `Renovação automática (calcula)`: executa login completo 1 dia antes da expiração da sessão.
- `Lock distribuído`: impede autenticações concorrentes (Redis).
- `Alerta de falha`: notifica por e-mail em caso de falha na autenticação, sem retry automático.

## Catálogo de Eventos
 
### Evento: `SessionAuthenticated`
- **Publicador:** `auth-service`
- **Consumidor:** `inventory-service`
- **Payload:**
```json
{
  "sessionId": "uuid",
  "cookieHeader": "string",
  "accessToken": "string",
  "authenticatedAt": "2026-08-06T10:00:00.000Z",
  "expiresAt": "2026-08-12T10:00:00.000Z"
}
```
> Sem pacote de contrato compartilhado entre repositórios (poli-repo): o consumidor valida este schema em runtime (ex: Zod).
 
## Acesso ao Projeto
 
```bash
git clone https://github.com/LucasAnchietaAmancio/ca-auth-service.git
cd auth-service
cp .env.example .env
```
 
### Rodando com Docker
 
```bash
docker compose up -d
```
 
## Tecnologias Utilizadas
 
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
| Persistência | PostgreSQL, Prisma ORM |
| Testes | Jest |
| Containerização | Docker, Docker Compose |
 

## Conclusão
 
O `auth-service` tem sua arquitetura hexagonal definida e documentação de requisitos, eventos e tecnologias fechada. Próximo passo: implementação incremental, começando pela camada de domínio e casos de uso.