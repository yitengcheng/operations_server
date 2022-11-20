/**
 * 删除部门接口
 */
const router = require('koa-router')();
const departmentSchema = require('../../models/departmentSchema');
const util = require('../../utils/util');
const lodash = require('lodash');

const findChildren = async (depart) => {
  const documents = await departmentSchema.find({ parentId: depart?._id, delFlag: false });
  let documentDocs = lodash.map(documents, '_doc');
  if (documentDocs?.length >= 1) {
    for (const document of documentDocs) {
      await findChildren(document);
    }
  }
  await departmentSchema.updateOne({ _id: depart?._id }, { delFlag: true });
};

router.post('/department/delDepartment', async (ctx) => {
  try {
    const { id, flagAll } = ctx.request.body;
    const { user } = ctx.state;
    if (flagAll) {
      const department = await departmentSchema.findOne({
        _id: id,
        delFlag: false,
      });
      await findChildren(department);
      await departmentSchema.updateOne({ _id: id, delFlag: false }, { delFlag: true });
    } else {
      const res = await departmentSchema.findOneAndUpdate({ _id: id, delFlag: false }, { delFlag: true });
      const params = res?.parentId ? { $set: { parentId: res?.parentId } } : { $unset: { parentId: '' } };
      await departmentSchema.updateMany({ parentId: id, delFlag: false }, params);
    }
    ctx.body = util.success({}, '删除成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
