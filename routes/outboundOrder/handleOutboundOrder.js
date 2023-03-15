/**
 * 添加出库单接口
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

router.post('/outboundOrder/handleOutboundOrder', async (ctx) => {
  try {
    const { outboundTime, orderNo, outboundType, receiveUser, remark, goodIds, hasSynchronous } = ctx.request.body;
    const { user } = ctx.state;
    const employee = await employeesSchema.findById(receiveUser);
    const newOutboundOrder = await outboundOrderSchema.create({
      outboundTime,
      orderNo,
      outboundType,
      receiveUser,
      remark,
      receiveDepartment: employee?.departmentId,
      voucherUser: user._id,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
      status: 4,
    });
    let outboundItems = [];

    for (const good of goodIds) {
      const res = await outboundOrderItemSchema.create({
        belongs: user?.belongs ?? user._id,
        delFlag: false,
        outboundOrderId: newOutboundOrder._id,
        remark: hasSynchronous ? remark : '',
        goodId: good?.id,
        goodNum: good?.goodNum,
      });
      const localGood = await goodsSchema.findById(good?._id);
      if (localGood?.inventoryNumber < good?.goodNum) {
        await outboundOrderItemSchema.remove({ outboundOrderId: newOutboundOrder._id });
        await outboundOrderSchema.remove({ _id: newOutboundOrder._id });
        ctx.body = util.fail({}, `出库失败${localGood?.name}库存数量不足`);
        return;
      }
      await goodsSchema.findByIdAndUpdate(good?.id, { $inc: { inventoryNumber: good?.goodNum * -1 } });
      outboundItems.push(res._id);
    }
    await outboundOrderSchema.updateOne(
      { _id: newOutboundOrder._id },
      {
        outboundItems: outboundItems,
        numberTotal: lodash.sumBy(goodIds, 'goodNum'),
        amountTotal: lodash.sumBy(goodIds, (o) => {
          return o.goodNum * o.price;
        }),
      },
    );

    ctx.body = util.success({}, '出库成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
