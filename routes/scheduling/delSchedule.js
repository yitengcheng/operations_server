/**
 * 移除值班接口
 */
const router = require("koa-router")();
const Scheduling = require("../../models/schedulingSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const dayjs = require("dayjs");
const { CODE } = require("../../utils/util");
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
dayjs.extend(isSameOrBefore);

router.post("/schedule/delete", async (ctx) => {
  try {
    const { workerId, dateOnDuty } = ctx.request.body;
    const { user } = ctx.state;
    if (!workerId) {
      ctx.body = util.fail("", "请选择员工", CODE.PARAM_ERROR);
    }
    if (!dateOnDuty) {
      ctx.body = util.fail("", "请选择排班日期", CODE.PARAM_ERROR);
    }
    const res = await Scheduling.remove({ dateOnDuty, companyId: user.companyId, staffIds: { $in: workerId } });
    if (res.deletedCount > 0) {
      ctx.body = util.success();
    } else {
      ctx.body = util.fail("", "移除失败");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
