/**
 * 添加/修改 路由
 */
const router = require("koa-router")();
const Menu = require("../../models/menuSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");

router.post("/addRouter", async (ctx) => {
  try {
    const { menuType, name, roleId } = ctx.request.body;
    const res = Menu.findOneAndUpdate({ name }, { $set: { menuType, name, roleId } }, { upsert: true, new: true });
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
