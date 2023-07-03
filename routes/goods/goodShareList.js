/**
 * 可分享物品列表接口（分页）(手机端)
 */
const router = require('koa-router')();
const goodsSchema = require('../../models/goodsSchema');
const util = require('../../utils/util');

router.post('/goods/goodShareList', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { keyword, params } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    let fuzzyQuery = {};
    if (keyword) {
      fuzzyQuery = util.fuzzyQuery(['name', 'fixedNumber'], keyword);
    }
    const res = await goodsSchema
      .find({ ...fuzzyQuery, belongs: params?.customerId ?? { $in: user?.customerList }, delFlag: false })
      .skip(skipIndex)
      .limit(page.pageSize)
      .populate([{ path: 'supplierId' }, { path: 'unit' }, { path: 'classification', match: { hasShare: true } }]);
    const total = await goodsSchema.countDocuments({
      ...fuzzyQuery,
      belongs: params?.customerId ?? { $in: user?.customerList },
      delFlag: false,
    });
    ctx.body = util.success({ total, list: res });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
