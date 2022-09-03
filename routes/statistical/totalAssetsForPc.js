/**
 * 资产统计接口
 */
const router = require('koa-router')();
const CompanyTemplate = require('../../models/companyTemplateSchema');
const util = require('../../utils/util');
const mongoose = require('mongoose');
const config = require('../../config');
const _ = require('lodash');

router.post('/statistical/total/assets', async (ctx) => {
  const db = mongoose.createConnection(config.URL);
  try {
    const { user } = ctx.state;
    const { params } = ctx.request.body;
    let customer = {};
    if (!user?.roleId) {
      customer = { customerId: user?._id };
    }
    const assetsTemplate = await CompanyTemplate.findOne({ companyId: user.companyId, type: '1' });
    let assetsSchema = await util.schemaProperty(assetsTemplate.content);
    let assetsModule = db.model(assetsTemplate.moduleName, assetsSchema, assetsTemplate.moduleName);
    let select = await util.schemaSelect(assetsTemplate.content);
    const data = await assetsModule.find({ ...params, ...customer }, select);
    delete assetsSchema.customerId;
    const fields = _.keys(assetsSchema);
    ctx.body = util.success({ data, fields });
  } catch (error) {
    ctx.body = util.fail(error.stack);
  } finally {
    db.close();
  }
});

module.exports = router;
