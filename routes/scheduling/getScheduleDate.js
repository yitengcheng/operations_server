/**
 * 根据月份获取值班人员接口(新)
 */
const router = require("koa-router")();
const Scheduling = require("../../models/schedulingSchema");
const Role = require("../../models/roleSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const dayjs = require("dayjs");
const { CODE } = require("../../utils/util");

router.post("/distribute/listById", async (ctx) => {
  try {
    const { dutyTime, workerId } = ctx.request.body;
    const { user } = ctx.state;
    if (!dutyTime || !workerId) {
      ctx.body = util.fail("", "参数错误", CODE.PARAM_ERROR);
      return;
    }
    const params = {
      dateOnDuty: {
        $gte: dayjs(dayjs(dutyTime).startOf("month")).toISOString(),
        $lte: dayjs(dayjs(dutyTime).endOf("month")).toISOString(),
      },
      staffIds: { $in: [workerId] },
      companyId: user.companyId,
    };

    const res = await Scheduling.find(params, { dateOnDuty: 1, staffIds: 1 });
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
