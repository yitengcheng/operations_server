/**
 * 删除部门定额接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const branchQuotaSchema = require('../../models/branchQuotaSchema');

router.post('/branchQutas/delBranchQutas', async (ctx) => {
  try {
    const { ids } = ctx.request.body;
    await branchQuotaSchema.updateMany({ _id: { $in: ids } }, { delFlag: true });
    ctx.body = util.success({}, '删除成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
