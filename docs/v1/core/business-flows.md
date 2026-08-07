### ***Fluxos de Negócio - auth-service***

### ***Gatilhos***
- Execução manual
- Scheduler
- Sessão inválida

### ***Fluxo principal***
- Cadastrar empresa
- Receber solicitação de autenticação.
- Adquirir lock distribuído.
- Verificar se o lock foi adquirido.
- Obter as credenciais de autenticação.
- Iniciar o processo de autenticação.
- Autenticar utilizando as credenciais.
- Gerar o código TOTP e garantir sua validade.
- Validar o segundo fator de autenticação.
- Capturar os cookies da sessão.
- Capturar o Access Token.
- Persistir a sessão autenticada.
- Publicar o evento SessionAuthenticated.
- Agendar a próxima autenticação.
- Liberar o lock distribuído.
- Encerrar o fluxo.

### ***Fluxo Alternativo A1 - Lock já existente***

- Receber solicitação de autenticação.
- Tentar adquirir o lock distribuído.
- Não conseguir adquirir o lock.
- Encerrar a execução.

### ***Fluxo Alternativo A2 - Falha na autenticação***

- Receber solicitação de autenticação.
- Executar o fluxo principal até a etapa de autenticação.
- Detectar falha na autenticação (credenciais inválidas, TOTP inválido, CAPTCHA, indisponibilidade do serviço ou mudança de layout).
- Registrar o erro em log.
- Enviar alerta por e-mail.
- Liberar o lock distribuído.
- Encerrar a execução.
