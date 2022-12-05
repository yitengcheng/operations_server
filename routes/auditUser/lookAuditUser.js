/**
 * 查看审核人接口
 */
const router = require('koa-router')();
const util = require('../../utils/util');
const auditUserSchema = require('../../models/auditUserSchema');
const lodash = require('lodash');

router.post('/auditUser/lookAuditUser', async (ctx) => {
  try {
    const { user } = ctx.state;
    const res = await auditUserSchema.findOne({ belongs: user?.belongs ?? user._id });
    ctx.body = util.success(res, '');
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
