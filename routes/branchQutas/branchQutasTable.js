/**
 * 部门定额列表接口（分页）
 */
const router = require('koa-router')();
const branchQuotaSchema = require('../../models/branchQuotaSchema');
const util = require('../../utils/util');

router.post('/branchQutas/branchQutasTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const res = await branchQuotaSchema
      .find({
        ...params,
        belongs: user?.belongs ?? user._id,
        delFlag: false,
      })
      .skip(skipIndex)
      .limit(page.pageSize)
      .populate([
        { path: 'departmentId' },
        {
          path: 'goodId',
          populate: ['unit'],
        },
      ]);
    const total = await branchQuotaSchema.countDocuments({
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
