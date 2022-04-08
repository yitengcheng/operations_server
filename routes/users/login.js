/**
 * 登录接口
 */
const router = require("koa-router")();
const User = require("../../models/userSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const dayjs = require("dayjs");

router.post("/app/login", async (ctx) => {
  try {
    const { username, password, registrationId } = ctx.request.body;
    /**
     * 返回数据库指定字段
     * 通过字段的对象1代表返回0代表不返回{ userId: 1, _id: 0}
     */
    const res = await User.findOneAndUpdate(
      { username, password: md5(password), status: 0 },
      { loginDate: dayjs().format("YYYY-MM-DD"), registrationId },
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
        },
      }
    ).populate("roleId", { name: 1 });
    const token = jwt.sign({ ...res?._doc }, "cdxs", { expiresIn: "24h" });
    if (res) {
      ctx.body = util.success({ token, userInfo: res }, "登录成功");
    } else {
      ctx.body = util.fail("", "账号或密码不正确");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
