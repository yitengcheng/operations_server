/**
 * 获取可调班日期接口
 */
const router = require('koa-router')();
const Scheduling = require('../../models/schedulingSchema');
const util = require('../../utils/util');

router.post('/distribute/getDutyDates', async (ctx) => {
  try {
    const { user } = ctx.state;
    const res = await Scheduling.find({ staffIds: { $in: user._id } }, { dateOnDuty: 1, _id: 1 });
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
