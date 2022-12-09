/**
 * 超限库存预警列表接口（分页）
 */
const router = require('koa-router')();
const goodsSchema = require('../../models/goodsSchema');
const util = require('../../utils/util');

router.post('/goods/goodWarringTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const res = await goodsSchema
      .find({
        $or: [
          { $expr: { $gt: ['$inventoryNumber', '$inventoryMax'] } },
          { $expr: { $lt: ['$inventoryNumber', '$inventoryMin'] } },
        ],
        belongs: user?.belongs ?? user._id,
        delFlag: false,
      })
      .skip(skipIndex)
      .limit(page.pageSize)
      .populate(['supplierId', 'unit', 'classification']);
    const total = await goodsSchema.countDocuments({
      $or: [
        { $expr: { $gt: ['$inventoryNumber', '$inventoryMax'] } },
        { $expr: { $lt: ['$inventoryNumber', '$inventoryMin'] } },
      ],
      belongs: user?.belongs ?? user._id,
      delFlag: false,
    });
    ctx.body = util.success({ total, list: res });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
