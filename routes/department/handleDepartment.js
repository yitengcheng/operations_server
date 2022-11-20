/**
 * 添加/编辑 部门接口
 */
const router = require('koa-router')();
const departmentSchema = require('../../models/departmentSchema');
const util = require('../../utils/util');

router.post('/department/handleDepartment', async (ctx) => {
  try {
    const { departmentName, parentId, id } = ctx.request.body;
    const { user } = ctx.state;
    const res = await departmentSchema.findOne({ departmentName, delFlag: false });
    const department = res?._doc;
    if (department && id !== department._id.toString()) {
      ctx.body = util.fail('', '已有同样名称的部门了');
      return;
    }
    if (id) {
      const result = await departmentSchema.updateOne({ _id: id, delFlag: false }, { departmentName, parentId });
      ctx.body = util.success({}, '修改成功');
    } else {
      await departmentSchema.create({ departmentName, belongs: user._id, parentId });
      ctx.body = util.success({}, '添加成功');
    }
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
