/**
 * 添加事项接口
 */
const router = require('koa-router')();
const dayjs = require('dayjs');
const matterSchema = require('../../models/matterSchema');
const util = require('../../utils/util');

router.post('/matters/addMatters', async (ctx) => {
  try {
    const { content, recordTime } = ctx.request.body;
    const { user } = ctx.state;
    await matterSchema.create({
      content,
      recordTime: dayjs(recordTime).toDate(),
      recordUser: user._id,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
    });

    ctx.body = util.success({}, '事项添加成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
