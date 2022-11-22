/**
 * 选项列表接口（不分页）
 */
const router = require('koa-router')();
const optionSchema = require('../../models/optionSchema');
const util = require('../../utils/util');

router.post('/options/options', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { type } = ctx.request.body;
    const res = await optionSchema.find({ type, belongs: user?.belongs ?? user._id, delFlag: false });
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
