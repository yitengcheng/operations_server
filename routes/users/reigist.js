/**
 * 注册接口
 */
const router = require("koa-router")();
const User = require("../../models/userSchema");
const Role = require("../../models/roleSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

router.post("/system/user/reigist", async (ctx) => {
  try {
    ctx.body = util.success();
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
