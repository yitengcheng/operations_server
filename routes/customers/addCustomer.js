/**
 * 添加/修改 客户信息接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const Role = require('../../models/roleSchema');
const companySchema = require('../../models/companySchema');
const customerSchema = require('../../models/customerSchema');
const md5 = require('md5');
const userSchema = require('../../models/userSchema');
const lodash = require('lodash');

router.post('/customer/insert', async (ctx) => {
  try {
    const { name, password, username, id, address, phone, headName, repairMan } = ctx.request.body;
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
      const customer = await customerSchema.findById(id);
      if (customer.repairMan !== repairMan && !customer.repairMan) {
        let user = await userSchema.findById(customer.repairMan);
        let tmp = user?.customerList ?? [];
        await userSchema.updateOne(
          { _id: customer.repairMan },
          { $set: { customerList: lodash.remove(tmp, customer._id) } },
        );
        user = await userSchema.findById(repairMan);
        tmp = user?.customerList ?? [];
        tmp.push(customer._id);
        await userSchema.updateOne({ _id: repairMan }, { $set: { customerList: lodash.uniq(tmp) } });
      }
      const updateRes = await customerSchema.findByIdAndUpdate(
        id,
        {
          $set: { name, password: password ? md5(password) : undefined, username, address, phone, headName, repairMan },
        },
        { new: true },
      );
      if (updateRes) {
        ctx.body = util.success(updateRes, '修改成功');
      } else {
        ctx.body = util.fail('', '修改失败');
      }
    } else {
      const newCustomer = await customerSchema.create({
        name,
        password: md5(password ? password : '123456'),
        username,
        address,
        phone,
        headName,
        companyId: user.companyId,
        repairMan,
        type: 1,
      });
      const user = await userSchema.findById(repairMan);
      let tmp = user?.customerList ?? [];
      tmp.push(newCustomer._id);
      await userSchema.updateOne({ _id: repairMan }, { $set: { customerList: lodash.uniq(tmp) } });
      ctx.body = util.success({}, '添加成功');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
