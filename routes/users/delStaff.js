/**
 * 删除员工接口
 */
const router = require("koa-router")();
const User = require("../../models/userSchema");
const Role = require("../../models/roleSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");

router.post("/system/user/delete", async (ctx) => {
  try {
    const { id } = ctx.request.body;
    const { user } = ctx.state;
    const role = await Role.findById(user.roleId._id);
    if (role?.name === "运维公司") {
      const res = await User.remove({ _id: id });
      if (res.deletedCount > 0) {
        ctx.body = util.success("", "删除成功");
      } else {
        ctx.body = util.fail("", "删除失败");
      }
    } else {
      ctx.body = util.fail("", "您没有删除员工的权限");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
