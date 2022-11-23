/**
 * 删除下属员工接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const employeesSchema = require('../../models/employeesSchema');

router.post('/employees/delEmployee', async (ctx) => {
  try {
    const { ids } = ctx.request.body;
    await employeesSchema.updateMany({ _id: { $in: ids } }, { delFlag: true });
    ctx.body = util.success({}, '删除成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
