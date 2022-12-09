/**
 * 领用出库单接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const outboundOrderItemSchema = require('../../models/outboundOrderItemSchema');
const outboundOrderSchema = require('../../models/outboundOrderSchema');
const goodsSchema = require('../../models/goodsSchema');
const employeesSchema = require('../../models/employeesSchema');
const branchQuotaSchema = require('../../models/branchQuotaSchema');
const lodash = require('lodash');
const dayjs = require('dayjs');

router.post('/outboundOrder/stockRemovalOrder', async (ctx) => {
  try {
    const { id, outboundTime, outboundType, remark, hasSynchronous } = ctx.request.body;
    const { user } = ctx.state;
    const outboundOrder = await outboundOrderSchema.findById(id).populate('outboundItems');
    for (const outboundItem of outboundOrder?.outboundItems) {
      const localGood = goodsSchema.findById(outboundItem?.goodId);
      if (localGood?.inventoryNumber < outboundItem?.goodNum) {
        await outboundOrderItemSchema.remove({ outboundOrderId: id });
        await outboundOrderSchema.remove({ _id: id });
        ctx.body = util.fail({}, `出库失败${localGood?.name}库存数量不足`);
        return;
      }
      await outboundOrderItemSchema.findByIdAndUpdate(outboundItem?._id, {
        remark: hasSynchronous ? remark : '',
        outboundTime,
      });
      await goodsSchema.findByIdAndUpdate(outboundItem?.goodId, {
        $inc: { inventoryNumber: outboundItem?.goodNum * -1 },
      });
    }
    await outboundOrderSchema.updateOne({ _id: id }, { status: 4, outboundTime });
    ctx.body = util.success({}, '领用成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
