import { createConnection } from "typeorm";
import "reflect-metadata";

import * as Koa from "koa";

import * as compress from "koa-compress";
import * as helmet from "koa-helmet";
import * as logger from "koa-logger";
import { absence } from "./middleware/absence";
import { responder } from "./middleware/responder";

import * as mount from "koa-mount";
import { api } from "./api";
import { serve } from "./serve";

async function main() {
  await createConnection();

  new Koa()
    .use(compress())
    .use(helmet())
    .use(logger())
    .use(responder())
    .use(mount("/api", api))
    .use(mount(serve))
    .use(absence())
    .listen(process.env.PORT);
}

main();
