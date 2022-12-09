/**
 * 部门/人员领用汇总表接口（分页）
 */
const router = require('koa-router')();
const outboundOrderSchema = require('../../models/outboundOrderSchema');
const outboundOrderItemSchema = require('../../models/outboundOrderItemSchema');
const util = require('../../utils/util');
const lodash = require('lodash');

router.post('/outboundOrder/accessTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const timeParams = util.timeQuery(params?.outboundTime, 'outboundTime');
    delete params?.outboundTime;
    const outboundOrders = await outboundOrderSchema.find({
      ...timeParams,
      ...params,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
      status: 4,
    });
    const outboundIds = lodash.map(outboundOrders, '_id');
    const res = await outboundOrderItemSchema
      .find({ belongs: user?.belongs ?? user._id, delFlag: false, outboundOrderId: { $in: outboundIds } })
      .skip(skipIndex)
      .limit(page.pageSize)
      .populate([{ path: 'goodId', populate: ['unit', 'classification'] }]);
    const total = await outboundOrderItemSchema.countDocuments({
      belongs: user?.belongs ?? user._id,
      delFlag: false,
      outboundOrderId: { $in: outboundIds },
    });
    ctx.body = util.success({ total, list: res });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
