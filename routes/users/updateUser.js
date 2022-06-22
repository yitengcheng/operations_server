/**
 * 修改用户信息接口
 */
const router = require('koa-router')();
const User = require('../../models/userSchema');
const util = require('../../utils/util');

router.post('/system/user/profile', async (ctx) => {
  try {
    const { nickName, sex, username, phonenumber, avatar } = ctx.request.body;
    const { user } = ctx.state;
    const res = await User.updateOne({ _id: user._id }, { $set: { nickName, sex, username, phonenumber, avatar } });
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
