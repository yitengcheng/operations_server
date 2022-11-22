/**
 * 供应商列表接口（分页）
 */
const router = require('koa-router')();
const supplierSchema = require('../../models/supplierSchema');
const util = require('../../utils/util');

router.post('/suppliers/supplierTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { keyword } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const fuzzyQuery = util.fuzzyQuery(
      ['name', 'headerUser', 'phone', 'wechat', 'email', 'address', 'remark'],
      keyword,
    );
    const res = await supplierSchema
      .find({ ...fuzzyQuery, belongs: user?.belongs ?? user._id, delFlag: false })
      .skip(skipIndex)
      .limit(page.pageSize);
    const total = await supplierSchema.countDocuments({
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
