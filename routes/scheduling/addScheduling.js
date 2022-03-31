/**
 * 添加值班接口(旧)
 */
const router = require("koa-router")();
const Scheduling = require("../../models/schedulingSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const dayjs = require("dayjs");

router.post("/distribute/insert", async (ctx) => {
  try {
    const { userIds, dutyTime } = ctx.request.body;
    const { user } = ctx.state;
    const res = await Scheduling.findOneAndUpdate(
      { dateOnDuty: dutyTime },
      { $set: { staffIds: userIds, companyId: user.companyId } },
      { upsert: true, new: true }
    );
    if (res) {
      ctx.body = util.success("", "排班成功");
    } else {
      ctx.body = util.fail("", "排班失败");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
