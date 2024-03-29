/**
 * 查看出库单接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const outboundOrderSchema = require('../../models/outboundOrderSchema');

router.post('/outboundOrder/outboundOrder', async (ctx) => {
  try {
    const { id } = ctx.request.body;
    const { user } = ctx.state;
    const outboundOrder = await outboundOrderSchema
      .findById(id)
      .populate([
        { path: 'outboundItems', populate: [{ path: 'goodId', populate: ['unit', 'classification', 'supplierId'] }] },
        { path: 'outboundType' },
        { path: 'receiveUser' },
        { path: 'receiveDepartment' },
        { path: 'voucherUser' },
      ]);
    ctx.body = util.success(outboundOrder, '');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
