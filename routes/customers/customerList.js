/**
 * 客户信息接口 (分页)
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const companySchema = require('../../models/companySchema');
const customerSchema = require('../../models/customerSchema');

router.post('/customer/customerList', async (ctx) => {
  try {
    const { keyword } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const fuzzyQuery = util.fuzzyQuery(['name', 'username'], keyword);
    const { user } = ctx.state;
    const company = await companySchema.findById(user.companyId);
    if (!company) {
      ctx.body = util.fail('', '公司不存在，请联系管理员');
    }
    const list = await customerSchema
      .find({ companyId: user.companyId, ...fuzzyQuery })
      .skip(skipIndex)
      .limit(page.pageSize);
    const total = await customerSchema.countDocuments({ companyId: user.companyId, ...fuzzyQuery });
    ctx.body = util.success({ total, list });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
