/**
 * 同意申请调班接口
 */
const router = require("koa-router")();
const ChangeScheduling = require("../../models/changeSchedulingSchema");
const Scheduling = require("../../models/schedulingSchema");
const Role = require("../../models/roleSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const dayjs = require("dayjs");
const _ = require("lodash");

router.post("/distribute/mix/agree", async (ctx) => {
  try {
    const { id, reason } = ctx.request.body;
    const { user } = ctx.state;
    const role = await Role.findOne({ _id: user.roleId._id });
    if (role && role.name == "运维工人") {
      ctx.body = util.fail("", `您没有审核调班的权力`);
      return;
    }
    const changeScheduling = await ChangeScheduling.findByIdAndUpdate(
      id,
      { $set: { status: 2, reason } },
      { new: true }
    );
    const { status, dutyTime, applyUser, mixUser } = changeScheduling;
    if (status === 2) {
      const res = await Scheduling.findOneAndUpdate(
        {
          dateOnDuty: dutyTime,
          staffIds: { $in: [applyUser] },
        },
        { $set: { "staffIds.$": mixUser } }
      );
      if (res) {
        ctx.body = util.success("", `审核成功`);
      } else {
        await ChangeScheduling.findByIdAndUpdate(id, { $set: { status: 3 } });
        ctx.body = util.fail("", `申请者在${dutyTime}并无值班任务`);
      }
    } else {
      ctx.body = util.fail("", "审核失败，请稍后再试");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
