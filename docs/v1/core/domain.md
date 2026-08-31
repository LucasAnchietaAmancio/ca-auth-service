### ***Domain auth-service***

#### **SessionEntity**

##### *Entrada*
    cookieHeader - String
    expiresAt - Number
    acessToken - String 

##### *Saída*
    SessionEntity {
        sessionId: string,
        cookieHeader : string,
        expiresAt: number,
        acessToken string
    }

#### **CompanyEntity**

##### *Entrada*
    companyName - String
    email - String
    password - String 

##### *Saída*
    SessionEntity {
        companyId: string,
        ompanyName: string,
        email: string,
    }

