/**
 * 入库单列表接口（分页）
 */
const router = require('koa-router')();
const godownEntrySchema = require('../../models/godownEntrySchema');
const util = require('../../utils/util');

router.post('/godownEntry/godownEntryTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const timeParams = util.timeQuery(params?.storageTime, 'storageTime');
    delete params.storageTime;
    const res = await godownEntrySchema
      .find({ ...timeParams, ...params, belongs: user?.belongs ?? user._id, delFlag: false })
      .skip(skipIndex)
      .limit(page.pageSize)
      .populate([{ path: 'storageType' }, { path: 'storageTime' }, { path: 'godownEntryIds', populate: ['goodId'] }]);
    const total = await godownEntrySchema.countDocuments({
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
