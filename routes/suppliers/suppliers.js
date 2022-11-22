/**
 * 供应商列表接口（不分页）
 */
const router = require('koa-router')();
const supplierSchema = require('../../models/supplierSchema');
const util = require('../../utils/util');

router.post('/suppliers/suppliers', async (ctx) => {
  try {
    const { user } = ctx.state;
    const res = await supplierSchema.find({ belongs: user?.belongs ?? user._id, delFlag: false });
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
