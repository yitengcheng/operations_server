/**
 * 商家供货列表接口（分页）
 */
const router = require('koa-router')();
const godownEntrySchema = require('../../models/godownEntrySchema');
const godownEntryItemSchema = require('../../models/godownEntryItemSchema');
const util = require('../../utils/util');
const lodash = require('lodash');

router.post('/godownEntry/godownSupplierTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const timeParams = util.timeQuery(params?.storageTime, 'storageTime');
    delete params.storageTime;
    const godownEntrys = await godownEntrySchema.find({
      ...timeParams,
      ...params,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
      status: 1,
    });
    const godownEntryIds = lodash.map(godownEntrys, '_id');
    const res = await godownEntryItemSchema
      .find({ belongs: user?.belongs ?? user._id, delFlag: false, godownEntryId: { $in: godownEntryIds } })
      .skip(skipIndex)
      .limit(page.pageSize)
      .populate([{ path: 'goodId', populate: ['unit', 'classification'] }, { path: 'godownEntryId' }]);
    const total = await godownEntryItemSchema.countDocuments({
      belongs: user?.belongs ?? user._id,
      delFlag: false,
      godownEntryId: { $in: godownEntryIds },
    });
    ctx.body = util.success({ total, list: res });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
