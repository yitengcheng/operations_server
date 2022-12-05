/**
 * 查看审核状态接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const outboundOrderSchema = require('../../models/outboundOrderSchema');

router.post('/outboundOrder/lookAuditStatus', async (ctx) => {
  try {
    const { id } = ctx.request.body;
    const { user } = ctx.state;
    const outboundOrder = await outboundOrderSchema
      .findById(id)
      .populate([{ path: 'auditStatusList', populate: [{ path: 'auditUser' }] }]);
    ctx.body = util.success(outboundOrder, '');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
