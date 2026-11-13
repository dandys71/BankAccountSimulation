/**
 * Controller vyřídí HTTP požadavek, servisa rozhodne „co se má stát“ a model je místo, kde se drží a načítají data.
 */

import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import { router as accountsRouter } from "./routes/accounts.js";
import { router as usersRouter } from "./routes/users.js";
import { router as healthRouter } from "./routes/health.js";
import { router as transactionsRouter } from "./routes/transactions.js";
import { router as standingOrdersRouter } from "./routes/standingOrder.js";
import { router as savingAccountsRoutes } from "./routes/savingAccounts.js";
import { router as templatesRouter } from "./routes/templates.js";
import { router as fatesRouter } from "./routes/fates.js";
import { router as timeRouter } from "./routes/time.js";
import { router as payrollRouter } from "./routes/payroll.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import { authMiddleware } from "./middlewares/auth.js";
import { migrate } from "./db/migrate.js";
import { startCron } from "./services/cronService.js";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/v1/health", healthRouter);

app.use("/v1", authMiddleware);

app.use("/v1/accounts", accountsRouter);
app.use("/v1/users", usersRouter);
app.use("/v1/transactions", transactionsRouter);
app.use("/v1/savingsAccounts", savingAccountsRoutes);
app.use("/v1/standingOrders", standingOrdersRouter);
app.use("/v1/templates", templatesRouter);
app.use("/v1/fates", fatesRouter);
app.use("/v1/time", timeRouter);
app.use("/v1/payroll", payrollRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5001;

async function start() {
  try {
    await migrate();
    console.log("✅ Připojeno k DB a schéma je připravené");
  } catch (err) {
    console.error("❌ DB migrace / připojení selhalo", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`TransactionManager running on http://localhost:${PORT}`);
    startCron();
  });
}

start();
