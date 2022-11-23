/**
 * 物品列表接口(不分页)
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const goodsSchema = require('../../models/goodsSchema');

router.post('/goods/goods', async (ctx) => {
  try {
    const { user } = ctx.state;
    const res = await goodsSchema.find({ belongs: user?.belongs ?? user._id, delFlag: false });
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
