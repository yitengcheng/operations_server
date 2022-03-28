const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const log4js = require("./utils/log4");
const _ = require("lodash");
const koajwt = require("koa-jwt");
const config = require("./config/index");
const routers = require("./routes/index");
const util = require("./utils/util");

require("./config/db"); // 加载数据库

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  log4js.info(ctx.request);
  await next().catch((err) => {
    if (err.status === 401) {
      ctx.status = 200;
      ctx.body = util.fail("", "Token认证失败", util.CODE.AUTH_ERROR);
    } else {
      throw err;
    }
  });
});

// koajwt
app.use(
  koajwt({ secret: "cdxs" }).unless({
    path: config.unlessList,
  })
);

// routes
_.map(routers, (router) => {
  router.prefix("/api");
  app.use(router.routes(), router.allowedMethods());
});

// error-handling
app.on("error", (err, ctx) => {
  log4js.error(`${err.stack}`);
});

module.exports = app;
