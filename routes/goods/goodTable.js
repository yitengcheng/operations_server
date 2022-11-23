/**
 * 物品列表接口（分页）
 */
const router = require('koa-router')();
const goodsSchema = require('../../models/goodsSchema');
const util = require('../../utils/util');

router.post('/goods/goodTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    let zeroParams;
    let fuzzyQuery = {};
    if (params?.keyword) {
      fuzzyQuery = util.fuzzyQuery(['name', 'models'], params?.keyword);
      delete params?.keyword;
    }
    if (params?.zero) {
      zeroParams = { inventoryNumber: { $gt: 0 } };
      delete params.zero;
    }
    const res = await goodsSchema
      .find({ ...params, ...zeroParams, ...fuzzyQuery, belongs: user?.belongs ?? user._id, delFlag: false })
      .skip(skipIndex)
      .limit(page.pageSize)
      .populate(['supplierId', 'unit', 'classification']);
    const total = await goodsSchema.countDocuments({
      ...params,
      ...zeroParams,
      ...fuzzyQuery,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
    });
    ctx.body = util.success({ total, list: res });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
