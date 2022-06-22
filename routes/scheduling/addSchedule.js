/**
 * 添加值班接口(新)
 */
const router = require('koa-router')();
const Scheduling = require('../../models/schedulingSchema');
const util = require('../../utils/util');
const dayjs = require('dayjs');
const { CODE } = require('../../utils/util');
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');
dayjs.extend(isSameOrBefore);

router.post('/schedule/insert', async (ctx) => {
  try {
    const { workerId, dutyTimes } = ctx.request.body;
    const { user } = ctx.state;
    if (!workerId) {
      ctx.body = util.fail('', '请选择员工', CODE.PARAM_ERROR);
    }
    if (!dutyTimes) {
      ctx.body = util.fail('', '请选择排班日期', CODE.PARAM_ERROR);
    }
    let flag = false;
    dutyTimes?.forEach(async (dutyTime) => {
      if (dayjs(dutyTime).isSameOrBefore(dayjs(), 'day')) {
        flag = true;
        return;
      }
      await Scheduling.updateOne(
        { dateOnDuty: dutyTime, companyId: user.companyId },
        { $addToSet: { staffIds: workerId }, companyId: user.companyId, dateOnDuty: dutyTime },
        { upsert: true },
      );
    });
    ctx.body = util.success({ flag });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
