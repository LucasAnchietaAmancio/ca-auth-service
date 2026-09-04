import "dotenv/config";
import { PrismaClient } from "@prisma/client";

import App from "./app/App.js";

const db = new PrismaClient();
const app = new App(db).getApp();
const port = Number(process.env.PORT);

const server = app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});
