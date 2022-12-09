/**
 * 删除物品接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const goodsSchema = require('../../models/goodsSchema');

router.post('/goods/delGoods', async (ctx) => {
  try {
    const { ids } = ctx.request.body;
    await goodsSchema.updateMany({ _id: { $in: ids } }, { delFlag: true });
    ctx.body = util.success({}, '删除成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
