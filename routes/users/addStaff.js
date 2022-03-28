/**
 * 添加员工接口
 */
const router = require("koa-router")();
const User = require("../../models/userSchema");
const Role = require("../../models/roleSchema");
const util = require("../../utils/util");
const log4j = require("../../utils/log4");
const jwt = require("jsonwebtoken");
const md5 = require("md5");

router.post("/system/user/insert/staff", async (ctx) => {
  try {
    const { nickName, sex, phonenumber, status, username } = ctx.request.body;
    const { user } = ctx.state;
    const res = await User.findOne({ phonenumber, status: 0 });
    const role = await Role.findOne({ name: "运维工人" });
    if (res) {
      ctx.body = util.fail("", "此手机号已被注册");
    } else {
      const adduser = new User({
        nickName,
        sex,
        phonenumber,
        status,
        password: md5("123456"),
        companyId: user.companyId,
        roleId: role._id,
        username,
      });
      adduser.save();
      ctx.body = util.success({}, "添加成功,默认密码：123456");
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
