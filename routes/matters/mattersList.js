/**
 * 获取事项列表（不分页）
 */
const router = require('koa-router')();
const dayjs = require('dayjs');
const matterSchema = require('../../models/matterSchema');
const util = require('../../utils/util');

router.post('/matters/mattersList', async (ctx) => {
  try {
    const { recordTime } = ctx.request.body;
    const { user } = ctx.state;
    console.log();
    const res = await matterSchema.find({
      recordUser: user._id,
      recordTime: { $gte: dayjs(recordTime).startOf('day').toDate(), $lte: dayjs(recordTime).endOf('day').toDate() },
    });
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
