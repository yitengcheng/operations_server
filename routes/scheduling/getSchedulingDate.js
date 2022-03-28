/**
 * 根据月份获取值班人员接口
 */
const router = require("koa-router")();
const Scheduling = require("../../models/schedulingSchema");
const Role = require("../../models/roleSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const dayjs = require("dayjs");

router.post("/distribute/list", async (ctx) => {
  try {
    const { dutyTime } = ctx.request.body;
    const { user } = ctx.state;
    const params = {
      dateOnDuty: {
        $gte: dayjs(dayjs(dutyTime).startOf("month")).toISOString(),
        $lte: dayjs(dayjs(dutyTime).endOf("month")).toISOString(),
      },
      companyId: user.companyId,
    };
    const role = await Role.findById(user.roleId._id);
    if (role.name === "运维工人") {
      params.staffIds = { $in: [user._id] };
    }

    const res = await Scheduling.find(params, { dateOnDuty: 1, staffIds: 1 }).populate("staffIds", {
      nickName: 1,
      _id: 1,
    });
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
