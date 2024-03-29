/**
 * 删除供应商接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const supplierSchema = require('../../models/supplierSchema');

router.post('/suppliers/delSuppliers', async (ctx) => {
  try {
    const { ids } = ctx.request.body;
    await supplierSchema.updateMany({ _id: { $in: ids } }, { delFlag: true });
    ctx.body = util.success({}, '删除成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
