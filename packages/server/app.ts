// From: https://github.com/justsml/guides/tree/master/express/setup-guide
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";

import ReposRouter from "./modules/repos/router";
import UsersRouter from "./modules/users/router";

export default express()
  .use(helmet())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(morgan(process.env.NODE_ENV !== "production" ? "dev" : "combined"))
  .use(cors({ origin: true, credentials: true }))
  .use("/api/repos", ReposRouter)
  .use("/api/users", UsersRouter)
  .get("/", (_req: Request, res: Response) =>
    res.send("Hi! Example API Server.")
  )
  .get("/ping", (_req: Request, res: Response) =>
    res.status(200).send({ response: "pong" })
  )
  // The following `app.use` MUST be last!
  .use(notFound, errorHandler);

function notFound(request: Request, response: Response) {
  response
    .status(404)
    .send({ error: "Not found!", status: 404, url: request.originalUrl });
}

function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
) {
  console.error("ERROR", error);
  const stack = process.env.NODE_ENV !== "production" ? error.stack : undefined;
  response
    .status(500)
    .send({ error: error.message, stack, url: request.originalUrl });
}
