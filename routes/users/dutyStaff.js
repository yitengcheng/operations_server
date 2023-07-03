/**
 * 获取运维员工
 */
const router = require('koa-router')();
const User = require('../../models/userSchema');
const Role = require('../../models/roleSchema');
const util = require('../../utils/util');

router.post('/system/user/list/staff', async (ctx) => {
  try {
    const { user } = ctx.state;
    const role = await Role.findOne({ name: '运维工人' });
    const res = await User.find({ companyId: user.companyId, roleId: role._id, status: 0 }, { _id: 1, nickName: 1 });
    if (res.length > 0) {
      ctx.body = util.success(res);
    } else {
      ctx.body = util.success();
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
