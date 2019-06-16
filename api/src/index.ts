import * as Koa from "koa";

import * as compress from "koa-compress";
import * as helmet from "koa-helmet";
import * as logger from "koa-logger";

import * as mount from "koa-mount";
import { serve } from "./serve";

new Koa()
  .use(compress())
  .use(helmet())
  .use(logger())
  .use(mount(serve))
  .listen(process.env.PORT);
