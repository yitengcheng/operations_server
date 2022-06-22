/**
 * PC端下载资产接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const Company = require('../../models/companySchema');
const util = require('../../utils/util');
const config = require('../../config');
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const path = require('path');
const _ = require('lodash');

router.post('/downAsset', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const company = await Company.findById(user.companyId);
    const companyTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '1' });
    if (!companyTemplate) {
      ctx.body = util.fail('', '请先设置公司资产模板');
      return;
    }
    let schema = await util.schemaProperty(companyTemplate.content);
    let assetsModule = db.model(companyTemplate.moduleName, schema, companyTemplate.moduleName);
    const assets = await assetsModule.find({}, { _id: 0, __v: 0 });
    const wb = xlsx.utils.book_new();
    const data = _.map(assets, '_doc');
    const ws = xlsx.utils.json_to_sheet(data);
    xlsx.utils.book_append_sheet(wb, ws, '资产');
    await xlsx.writeFile(wb, path.join(`${__dirname}../../../public/zip/${company.companyName}资产.xlsx`));
    ctx.body = util.success({ url: `zip/${company.companyName}资产.xlsx` });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
