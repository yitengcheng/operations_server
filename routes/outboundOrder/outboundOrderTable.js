/**
 * 出库单列表接口（分页）
 */
const router = require('koa-router')();
const outboundOrderSchema = require('../../models/outboundOrderSchema');
const util = require('../../utils/util');

router.post('/outboundOrder/outboundOrderTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const timeParams = util.timeQuery(params?.outboundTime, 'outboundTime');
    delete params?.outboundTime;
    const res = await outboundOrderSchema
      .find({ ...timeParams, ...params, belongs: user?.belongs ?? user._id, delFlag: false })
      .skip(skipIndex)
      .limit(page.pageSize)
      .populate([
        { path: 'outboundType' },
        { path: 'receiveUser' },
        { path: 'outboundTime' },
        { path: 'outboundItems', populate: [{ path: 'goodId', populate: ['unit'] }] },
      ]);
    const total = await outboundOrderSchema.countDocuments({
      ...timeParams,
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
