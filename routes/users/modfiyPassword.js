/**
 * 修改登录密码接口
 */
const router = require('koa-router')();
const User = require('../../models/userSchema');
const util = require('../../utils/util');
const md5 = require('md5');

router.post('/system/user/profile/updatePwd', async (ctx) => {
  try {
    const { oldPassword, newPassword } = ctx.request.body;
    const { user } = ctx.state;
    const res = await User.updateOne(
      { _id: user._id, password: md5(oldPassword) },
      { $set: { password: md5(newPassword) } },
    );
    if (res.modifiedCount > 0) {
      ctx.body = util.success(undefined, '修改成功');
    } else {
      ctx.body = util.fail('', '修改失败');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
