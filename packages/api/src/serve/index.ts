import * as Koa from "koa";
import * as send from "koa-send";
import * as supply from "koa-static";

/**
 * Application that serves files from `/public` directory. If no file matches
 * the requested path, `/public/index.html` file is served by default.
 */
export const serve = new Koa()
  .use(supply("public"))
  .use((context, next) =>
    context.method === "GET" ? send(context, "public/index.html") : next()
  );
