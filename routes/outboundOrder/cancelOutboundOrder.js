/**
 * 取消物品申领接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const outboundOrderSchema = require('../../models/outboundOrderSchema');

router.post('/outboundOrder/cancelOutboundOrder', async (ctx) => {
  try {
    const { id } = ctx.request.body;
    const { user } = ctx.state;
    await outboundOrderSchema.findByIdAndUpdate(id, { status: 6 });
    ctx.body = util.success({}, '取消申领成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
