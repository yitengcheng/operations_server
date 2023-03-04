/**
 * 库管库存预警接口
 */
const router = require('koa-router')();
const goodsSchema = require('../../models/goodsSchema');
const outboundOrderSchema = require('../../models/outboundOrderSchema');
const godownEntrySchema = require('../../models/godownEntrySchema');
const util = require('../../utils/util');

router.post('/statistical/stockWarringStatistical', async (ctx) => {
  const { user } = ctx.state;
  const goods = await goodsSchema
    .find(
      { belongs: user?.belongs ?? user._id, delFlag: false },
      { name: 1, inventoryNumber: 1, inventoryMax: 1, inventoryMin: 1, classification: 1 },
    )
    .populate([{ path: 'classification' }]);
  ctx.body = util.success(goods);
});

module.exports = router;
