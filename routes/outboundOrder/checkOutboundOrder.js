/**
 * 审核物品接口
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
const auditUserSchema = require('../../models/auditUserSchema');
const auditStatusSchema = require('../../models/auditStatusSchema');

router.post('/outboundOrder/checkOutboundOrder', async (ctx) => {
  try {
    const { id, auditStatus } = ctx.request.body;
    const { user } = ctx.state;
    const currentStatus = await auditStatusSchema.findOne({ outboundOrderId: id, auditUser: user._id, auditStatus: 1 });
    if (lodash.isNull(currentStatus)) {
      ctx.body = util.fail('', '您已审批过该申请单，无需再次审批');
      return;
    }
    await auditStatusSchema.updateOne(
      { outboundOrderId: id, auditUser: user._id },
      { auditStatus, auditTime: new Date() },
    );
    if (auditStatus === 3) {
      await outboundOrderSchema.findByIdAndUpdate(id, { status: 7 });
      ctx.body = util.success({}, '审批完成');
      return;
    }
    const result = await auditStatusSchema.find({ outboundOrderId: id, auditStatus: 1 });
    if (lodash.isNull(result)) {
      await outboundOrderSchema.findByIdAndUpdate(id, { status: 3 });
    } else {
      await outboundOrderSchema.findByIdAndUpdate(id, { status: 2 });
    }
    ctx.body = util.success({}, '审批完成');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
