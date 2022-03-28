/**
 * 获取员工列表
 */
const router = require("koa-router")();
const User = require("../../models/userSchema");
const Role = require("../../models/roleSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");

router.post("/system/user/list", async (ctx) => {
  try {
    const { page, skipIndex } = util.pager(ctx.request.body);
    const { user } = ctx.state;
    const role = await Role.findOne({ name: "运维工人" });
    const params = { companyId: user.companyId, roleId: role._id };
    const query = User.find(params, {
      _id: 1,
      nickName: 1,
      sex: 1,
      status: 1,
      phonenumber: 1,
      username: 1,
      loginDate: 1,
    });
    const list = await query.skip(skipIndex).limit(page.pageSize);
    const total = await User.countDocuments(params);
    ctx.body = util.success({
      total,
      list,
    });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
