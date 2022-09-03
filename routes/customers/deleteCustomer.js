/**
 * 删除客户信息接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const Role = require('../../models/roleSchema');
const companySchema = require('../../models/companySchema');
const customerSchema = require('../../models/customerSchema');

router.post('/customer/delete', async (ctx) => {
  try {
    const { id } = ctx.request.body;
    const { user } = ctx.state;
    const role = await Role.findById(user.roleId);
    if (role.name === '运维工人') {
      ctx.body = util.fail('', '你的权限不能添加/修改用户信息');
      return;
    }
    const company = await companySchema.findById(user.companyId);
    if (!company) {
      ctx.body = util.fail('', '公司不存在，请联系管理员');
    }
    const res = await customerSchema.deleteOne({
      companyId: user.companyId,
      _id: id,
    });
    if (res.deletedCount > 0) {
      ctx.body = util.success({}, '删除成功');
      return;
    }
    ctx.body = util.fail('', '删除失败');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
