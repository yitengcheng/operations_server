/**
 * 下属员工列表接口（不分页）
 */
const router = require('koa-router')();
const employeesSchema = require('../../models/employeesSchema');
const util = require('../../utils/util');

router.post('/employees/employees', async (ctx) => {
  try {
    const { user } = ctx.state;
    const res = await employeesSchema.find({ belongs: user?.belongs ?? user._id, delFlag: false });
    ctx.body = util.success(res);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
