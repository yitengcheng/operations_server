/**
 * 获取部门列表接口(不分页)
 */
const router = require('koa-router')();
const departmentSchema = require('../../models/departmentSchema');
const util = require('../../utils/util');
const lodash = require('lodash');

router.post('/department/departments', async (ctx) => {
  try {
    const { user } = ctx.state;
    const departments = await departmentSchema.find(
      { belongs: user?.belongs ?? user._id, delFlag: false },
      { _id: 1, departmentName: 1 },
    );
    ctx.body = util.success(departments, '');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
