/**
 * 删除选项接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const Role = require('../../models/roleSchema');
const optionSchema = require('../../models/optionSchema');
const md5 = require('md5');

router.post('/options/delOption', async (ctx) => {
  try {
    const { ids } = ctx.request.body;
    const { user } = ctx.state;
    const employee = await optionSchema.updateMany({ _id: { $in: ids } }, { delFlag: true });
    ctx.body = util.success({}, '删除成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
