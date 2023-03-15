/**
 * 添加/修改 下属员工接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const employeesSchema = require('../../models/employeesSchema');
const md5 = require('md5');

router.post('/employees/handleEmployee', async (ctx) => {
  try {
    const { departmentId, name, phone, id, password, type, remark, account } = ctx.request.body;
    const { user } = ctx.state;
    const employee = await employeesSchema.findOne({ account, belongs: user?.belongs ?? user._id, delFlag: false });
    if (employee && id !== employee._id.toString()) {
      ctx.body = util.fail('', '此账号已与他人绑定');
      return;
    }
    if (id) {
      await employeesSchema.updateOne(
        { _id: id, delFlag: false },
        { account, departmentId, name, phone, type, password: password ? md5(password) : undefined, remark },
      );
      ctx.body = util.success({}, '修改成功');
    } else {
      await employeesSchema.create({
        departmentId,
        account,
        name,
        phone,
        type,
        password: password ? md5(password) : undefined,
        remark,
        belongs: user?.belongs ?? user._id,
        delFlag: false,
      });
      ctx.body = util.success({}, '添加成功');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
