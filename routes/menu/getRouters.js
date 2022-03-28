/**
 * 获取路由接口
 */
const router = require("koa-router")();
const Menu = require("../../models/menuSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");

router.post("/getRouters", async (ctx) => {
  try {
    const { user } = ctx.state; // 通过中间件获取的token中携带的数据
    const data = await Menu.find({ roleId: { $in: [user.roleId._id] } }, { name: 1, menuType: 1 });
    if (data.length > 0) {
      ctx.body = util.success(data);
    } else {
      ctx.body = util.fail("", "您的权限不足使用此APP");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
