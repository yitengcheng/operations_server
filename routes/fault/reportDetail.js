/**
 * 故障详情接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const User = require('../../models/userSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');
const { CODE } = require('../../utils/util');

router.post('/fault/detail', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { faultId } = ctx.request.body;
    const { user } = ctx.state;
    if (!faultId) {
      ctx.body = util.fail('', '缺少工单id', CODE.PARAM_ERROR);
      return;
    }
    const faultTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '2' });
    const assetTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '1' });
    if (!faultTemplate) {
      ctx.body = util.fail('', '请先设置公司故障模板');
      return;
    }
    if (!assetTemplate) {
      ctx.body = util.fail('', '请先设置公司资产模板');
      return;
    }
    let guzhangSchema = await util.guzhangSchemaProperty(faultTemplate.content);
    let assetSchema = await util.schemaProperty(assetTemplate.content);
    let assetSelect = await util.schemaSelect(assetTemplate.content);
    let faultModule = db.model(faultTemplate.moduleName, guzhangSchema, faultTemplate.moduleName);
    let assetModule = db.model(assetTemplate.moduleName, assetSchema, assetTemplate.moduleName);
    const fault = await faultModule.findById(faultId);
    const asset = await assetModule.findById(fault.assetsId, assetSelect);
    const dispose = await User.findById(fault.dispose);
    ctx.body = util.success({ fault, asset, dispose });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
