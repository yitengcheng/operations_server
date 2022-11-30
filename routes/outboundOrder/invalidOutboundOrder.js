/**
 * 作废出库单接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const outboundOrderSchema = require('../../models/outboundOrderSchema');
const goodsSchema = require('../../models/goodsSchema');
const lodash = require('lodash');

router.post('/outboundOrder/invalidOutboundOrder', async (ctx) => {
  try {
    const { id } = ctx.request.body;
    const { user } = ctx.state;
    const outboundOrder = await outboundOrderSchema
      .findById(id)
      .populate([{ path: 'outboundItems', populate: ['goodId'] }]);
    const outboundItems = outboundOrder?.outboundItems;
    for (const outboundItem of outboundItems) {
      const res = await goodsSchema.updateOne(
        { _id: outboundItem?.goodId?._id },
        { $inc: { inventoryNumber: outboundItem?.goodNum * 1 } },
      );
      if (res?.modifiedCount === 0) {
        ctx.body = util.success({}, '作废时调整库存出错');
        return;
      }
    }
    await outboundOrderSchema.findByIdAndUpdate(id, { status: 5 });
    ctx.body = util.success({}, '作废成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
