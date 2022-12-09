/**
 * 库管库存、出库、入库总数接口
 */
const router = require('koa-router')();
const goodsSchema = require('../../models/goodsSchema');
const outboundOrderSchema = require('../../models/outboundOrderSchema');
const godownEntrySchema = require('../../models/godownEntrySchema');
const util = require('../../utils/util');

router.post('/statistical/stockStatisticalNumber', async (ctx) => {
  const { user } = ctx.state;
  const goodTotal = await goodsSchema.countDocuments({ belongs: user?.belongs ?? user._id, delFlag: false });
  const outboundOrderTotal = await outboundOrderSchema.countDocuments({
    belongs: user?.belongs ?? user._id,
    delFlag: false,
  });
  const godownEntryTotal = await godownEntrySchema.countDocuments({
    belongs: user?.belongs ?? user._id,
    delFlag: false,
  });
  ctx.body = util.success({ goodTotal, outboundOrderTotal, godownEntryTotal });
});

module.exports = router;
