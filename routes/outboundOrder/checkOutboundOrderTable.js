/**
 * 审核出库单列表接口（分页）
 */
const router = require('koa-router')();
const outboundOrderSchema = require('../../models/outboundOrderSchema');
const auditStatusSchema = require('../../models/auditStatusSchema');
const util = require('../../utils/util');
const lodash = require('lodash');

router.post('/outboundOrder/checkOutboundOrderTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { type } = ctx.request.body.params; // 1  当前 2 历史
    const { page, skipIndex } = util.pager(ctx.request.body);
    let params = {};
    let statusParams = {};
    if (type === 1) {
      params = { status: { $lt: 4 } };
      statusParams = { auditStatus: 1 };
    }
    if (type === 2) {
      statusParams = { auditStatus: { $gt: 1 } };
    }
    const checkPendingList = await auditStatusSchema.find({ auditUser: user._id, ...statusParams });
    const checkPendingIdList = lodash.map(checkPendingList, 'outboundOrderId');
    const res = await outboundOrderSchema
      .find({ _id: { $in: checkPendingIdList }, ...params, belongs: user?.belongs ?? user._id, delFlag: false })
      .skip(skipIndex)
      .limit(page.pageSize)
      .populate([
        { path: 'outboundType' },
        { path: 'receiveUser' },
        { path: 'outboundTime' },
        { path: 'outboundItems', populate: ['goodId'] },
      ]);
    const total = await outboundOrderSchema.countDocuments({
      _id: { $in: checkPendingIdList },
      ...params,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
    });
    ctx.body = util.success({ total, list: res });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
