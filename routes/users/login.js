/**
 * 登录接口
 */
const router = require('koa-router')();
const User = require('../../models/userSchema');
const customerSchema = require('../../models/customerSchema');
const util = require('../../utils/util');
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const dayjs = require('dayjs');
const employeesSchema = require('../../models/employeesSchema');

router.post('/app/login', async (ctx) => {
  try {
    const { username, password, registrationId, platform } = ctx.request.body;
    /**
     * 返回数据库指定字段
     * 通过字段的对象1代表返回0代表不返回{ userId: 1, _id: 0}
     */
    let res = await User.findOneAndUpdate(
      { username, password: md5(password), status: 0 },
      { loginDate: dayjs().format('YYYY-MM-DD'), registrationId },
      {
        fields: {
          userId: 1,
          username: 1,
          nickName: 1,
          sex: 1,
          phonenumber: 1,
          status: 1,
          companyId: 1,
          roleId: 1,
          avatar: 1,
          customerList: 1,
        },
      },
    ).populate([{ path: 'roleId', populate: ['name'] }, { path: 'customerList' }]);
    if (platform === 'stock') {
      res = await employeesSchema.findOne(
        { $or: [{ phone: username }, { account: username }], password: md5(password) },
        { password: 0 },
      );
      if (!res) {
        res = await customerSchema.findOne({ username, password: md5(password) }, { password: 0 });
      }
    } else if (!res) {
      res = await customerSchema.findOne({ username, password: md5(password) }, { password: 0 });
    }
    const token = jwt.sign({ ...res?._doc }, 'cdxs', { expiresIn: '24h' });
    if (res) {
      ctx.body = util.success({ token, userInfo: res }, '登录成功');
    } else {
      ctx.body = util.fail('', '账号或密码不正确');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
