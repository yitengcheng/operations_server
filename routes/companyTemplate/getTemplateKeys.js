/**
 * 公司模板key接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');

router.post('/template/key', async (ctx) => {
  try {
    const { type } = ctx.request.body;
    const { user } = ctx.state;
    const res = await CompanyTemplate.findOne({ companyId: user.companyId, type });
    const schema = await util.schemaProperty(res.content);
    const keys = Object.keys(schema);
    ctx.body = util.success(keys ?? []);
  } catch (error) {
    ctx.body = util.fail(error.stack);
  }
});

module.exports = router;
