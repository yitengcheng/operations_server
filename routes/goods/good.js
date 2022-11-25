/**
 * 查看物品
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const goodsSchema = require('../../models/goodsSchema');

router.post('/goods/good', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { id } = ctx.request.body;
    const res = await goodsSchema.findById(id).populate(['unit', 'classification', 'supplierId']);
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
