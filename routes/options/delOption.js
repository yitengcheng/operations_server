/**
 * 删除选项接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const optionSchema = require('../../models/optionSchema');

router.post('/options/delOption', async (ctx) => {
  try {
    const { ids } = ctx.request.body;
    await optionSchema.updateMany({ _id: { $in: ids } }, { delFlag: true });
    ctx.body = util.success({}, '删除成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
