/**
 * 修改员工接口
 */
const router = require('koa-router')();
const User = require('../../models/userSchema');
const Role = require('../../models/roleSchema');
const util = require('../../utils/util');

router.post('/system/user/update/staff', async (ctx) => {
  try {
    const { id, nickName, sex, phonenumber, status, username } = ctx.request.body;
    const { user } = ctx.state;
    const role = await Role.findById(user.roleId._id);
    if (role?.name === '运维公司') {
      const res = await User.updateOne({ _id: id }, { $set: { nickName, sex, phonenumber, status, username } });
      if (res.modifiedCount > 0) {
        ctx.body = util.success(undefined, '修改成功');
      } else {
        ctx.body = util.fail('', '修改失败');
      }
    } else {
      ctx.body = util.fail('', '您没有删除员工的权限');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
