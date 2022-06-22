/**
 * 申请调班接口
 */
const router = require('koa-router')();
const ChangeScheduling = require('../../models/changeSchedulingSchema');
const Scheduling = require('../../models/schedulingSchema');
const util = require('../../utils/util');
const dayjs = require('dayjs');

router.post('/distribute/mix', async (ctx) => {
  try {
    const { dutyTime, mixUser, mixRemark } = ctx.request.body;
    const { user } = ctx.state;
    const scheduling = await Scheduling.findOne({ dateOnDuty: dutyTime, staffIds: { $in: [mixUser] } });
    if (scheduling) {
      ctx.body = util.fail('', `您选择的调班人，在${dutyTime}已有值班任务`);
      return;
    }
    const res = await ChangeScheduling.findOneAndUpdate(
      { applyUser: user._id, dutyTime },
      {
        $set: {
          applyUser: user._id,
          dutyTime,
          mixUser,
          mixRemark,
          companyId: user.companyId,
          createTime: dayjs().format('YYYY-MM-DD'),
        },
      },
      { upsert: true, new: true },
    );
    if (res) {
      ctx.body = util.success('', '申请成功');
    } else {
      ctx.body = util.fail('', '申请失败');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
