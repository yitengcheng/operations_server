/**
 * 添加/修改 客户信息接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const Role = require('../../models/roleSchema');
const companySchema = require('../../models/companySchema');
const customerSchema = require('../../models/customerSchema');
const md5 = require('md5');

router.post('/customer/insert', async (ctx) => {
  try {
    const { name, password, username, id, address, phone, headName } = ctx.request.body;
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
    if (id) {
      const updateRes = await customerSchema.findByIdAndUpdate(
        id,
        { $set: { name, password: password ? md5(password) : undefined, username, address, phone, headName } },
        { new: true },
      );
      if (updateRes) {
        ctx.body = util.success(updateRes, '修改成功');
      } else {
        ctx.body = util.fail('', '修改失败');
      }
    } else {
      await customerSchema.create({
        name,
        password: md5(password ?? '123456'),
        username,
        address,
        phone,
        headName,
        companyId: user.companyId,
      });
      ctx.body = util.success({}, '添加成功');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
