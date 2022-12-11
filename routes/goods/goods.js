/**
 * 物品列表接口(不分页)
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const goodsSchema = require('../../models/goodsSchema');

router.post('/goods/goods', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { supplierId } = ctx.request.body;
    let params = {};
    if (supplierId) {
      params = { supplierId };
    }
    const res = await goodsSchema
      .find({ ...params, belongs: user?.belongs ?? user._id, delFlag: false })
      .populate(['supplierId', 'unit', 'classification']);
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
