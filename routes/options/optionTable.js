/**
 * 选项列表接口（分页）
 */
const router = require('koa-router')();
const optionSchema = require('../../models/optionSchema');
const util = require('../../utils/util');

router.post('/options/optionTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const res = await optionSchema
      .find({ ...params, belongs: user?.belongs ?? user._id, delFlag: false })
      .skip(skipIndex)
      .limit(page.pageSize);
    const total = await optionSchema.countDocuments({
      ...params,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
    });
    ctx.body = util.success({ total, list: res });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
