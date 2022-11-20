/**
 * 获取部门列表接口(树状)
 */
const router = require('koa-router')();
const departmentSchema = require('../../models/departmentSchema');
const util = require('../../utils/util');
const lodash = require('lodash');

const findChildren = async (depart) => {
  const documents = await departmentSchema.find({ parentId: depart?._id, delFlag: false });
  let documentDocs = lodash.map(documents, '_doc');
  let result = { children: [], name: '', id: '' };
  if (documentDocs?.length >= 1) {
    for (const document of documentDocs) {
      result.children.push(await findChildren(document));
    }
  }
  result.id = depart?._id;
  result.parentId = depart?.parentId;
  result.name = depart?.departmentName;
  return result;
};

router.post('/department/departmentTree', async (ctx) => {
  try {
    const { departmentName, parentId } = ctx.request.body;
    const { user } = ctx.state;
    const departments = await departmentSchema.find({
      belongs: user._id,
      parentId: { $exists: false },
      delFlag: false,
    });
    let departmentDocs = lodash.map(departments, '_doc');
    let result = { name: `共有${0}人`, children: [] };
    for (const department of departmentDocs) {
      result.children.push(await findChildren(department));
    }
    ctx.body = util.success(result, '');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
