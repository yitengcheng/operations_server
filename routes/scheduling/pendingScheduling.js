/**
 * 获取调班待处理申请数
 */
const router = require("koa-router")();
const ChangeScheduling = require("../../models/changeSchedulingSchema");
const Role = require("../../models/roleSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const dayjs = require("dayjs");

router.post("/distribute/report", async (ctx) => {
  try {
    const { user } = ctx.state;
    let params = {
      companyId: user.companyId,
      status: 1,
    };
    const role = await Role.findOne({ _id: user.roleId._id });
    if (role && role.name == "运维工人") {
      params.applyUser = user._id;
    }
    const total = await ChangeScheduling.countDocuments(params);
    ctx.body = util.success(total);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
