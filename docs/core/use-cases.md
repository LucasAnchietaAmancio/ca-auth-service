### ***Use Cases auth-service***

#### **AuthenticationUseCase**

##### *Entrada*
    void

##### *Saída*
    Session

##### *Fluxo*
    - Adiquire lock
    - Executa login 
    - Gera token TOTP
    - Valida MFA
    - Captura cookies
    - Publica evento.
    - Limpa lock