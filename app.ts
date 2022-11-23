// App Initialization;
import express, {Express, Request, Response} from "express";
const app:Express = express();

import pool from "./config";
import {authRouter} from "./routes";
import {notFoundMiddleware, errorHandlerMiddleWare} from "./middleware";


// middleware
app.use(express.json());
// Routes

app.get("/", async (req:Request, res:Response) => {
  try {
    const query = await pool.query('SELECT * FROM test');
    res.status(200).json({tests: query.rows, count: query.rowCount})
  } catch (e) {
    throw e;
  };
});
app.use("/api/v1", authRouter);
app.use(errorHandlerMiddleWare)
app.use(notFoundMiddleware);

app.listen(5000, () => console.log("server listening on port 5000"));
