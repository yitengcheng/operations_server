/**
 * 客户信息接口 (不分页)
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const companySchema = require('../../models/companySchema');
const customerSchema = require('../../models/customerSchema');

router.post('/customer/customers', async (ctx) => {
  try {
    const { user } = ctx.state;
    const company = await companySchema.findById(user.companyId);
    if (!company) {
      ctx.body = util.fail('', '公司不存在，请联系管理员');
    }
    const list = await customerSchema.find({ companyId: user.companyId }, { _id: 1, name: 1 });
    ctx.body = util.success({ list });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
