/**
 * 根据字段分类资产列表接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');

router.post('/assets/listByField', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { keyword, condition } = ctx.request.body;
    const { page, skipIndex } = util.pager(ctx.request.body);
    const { user } = ctx.state;
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '1' });
    if (!companyTemplate) {
      ctx.body = util.fail('', '请先设置公司资产模板');
      return;
    }
    let schema = await util.schemaProperty(companyTemplate.content);
    let select = await util.schemaSelect(companyTemplate.content);
    let assetsModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const fuzzyQuery = util.fuzzyQuery(Object.keys(schema), keyword);
    const list = await assetsModule
      .find({ ...fuzzyQuery, ...condition }, select)
      .skip(skipIndex)
      .limit(page.pageSize);
    const total = await assetsModule.countDocuments({ ...fuzzyQuery, ...condition });
    ctx.body = util.success({ total, list });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
