/**
 * 下属员工列表接口（分页）
 */
const router = require('koa-router')();
const employeesSchema = require('../../models/employeesSchema');
const util = require('../../utils/util');

router.post('/employees/employeeTable', async (ctx) => {
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const res = await employeesSchema
      .find({ ...params, belongs: user?.belongs ?? user._id, delFlag: false })
      .skip(skipIndex)
      .limit(page.pageSize)
      .populate(['departmentId']);
    const total = await employeesSchema.countDocuments({
      ...params,
      belongs: user?.belongs ?? user._id,
      delFlag: false,
    });
    ctx.body = util.success({ total, list: res });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
