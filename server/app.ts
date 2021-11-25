// From Dan's Guides: https://github.com/justsml/guides/tree/master/express/setup-guide
// TODO: INSTALL PRE-REQS:
//  npm install express cors morgan helmet nodemon
import express, { Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import CatRouter from "./routes/cats";

export default express()
  .use(helmet())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(morgan(process.env.NODE_ENV !== "production" ? "dev" : "combined"))
  .use(cors({ origin: true, credentials: true }))
  .use("/api/cat", CatRouter)
  // The following 2 `app.use`'s MUST be last
  .use(notFound)
  .use(errorHandler);

function notFound(request: Request, response: Response) {
  response
    .status(404)
    .send({ error: "Not found!", status: 404, url: request.originalUrl });
}

function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  console.error("ERROR", error);
  const stack = process.env.NODE_ENV !== "production" ? error.stack : undefined;
  response
    .status(500)
    .send({ error: error.message, stack, url: request.originalUrl });
}
