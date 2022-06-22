/**
 * 资产总数接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');

router.post('/assets/count', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '1' });
    if (!companyTemplate) {
      ctx.body = util.fail('', '请先设置公司资产模板');
      return;
    }
    let schema = await util.schemaProperty(companyTemplate.content);
    let assetsModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const total = await assetsModule.countDocuments();
    ctx.body = util.success({ assetTotal: total });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
