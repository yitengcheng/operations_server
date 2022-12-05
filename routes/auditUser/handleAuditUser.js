/**
 * 添加/修改审核人接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const auditUserSchema = require('../../models/auditUserSchema');
const lodash = require('lodash');

router.post('/auditUser/handleAuditUser', async (ctx) => {
  try {
    const { auditUserList } = ctx.request.body;
    const { user } = ctx.state;
    await auditUserSchema.findOneAndUpdate(
      { belongs: user?.belongs ?? user._id },
      { auditUserList, delFlag: false, belongs: user?.belongs ?? user._id },
      { upsert: true },
    );
    ctx.body = util.success({}, '添加/修改成功');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
